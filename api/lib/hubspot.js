/**
 * HubSpot CRM Integration (Vercel Serverless)
 */

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

const getAccessToken = () => process.env.HUBSPOT_ACCESS_TOKEN;

export function isHubSpotConfigured() {
  return !!getAccessToken();
}

async function hubspotRequest(endpoint, options = {}) {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error('HubSpot access token not configured');
  }

  const response = await fetch(`${HUBSPOT_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('HubSpot API error:', data);
    throw new Error(data.message || `HubSpot API error: ${response.status}`);
  }

  return data;
}

export const hubspotContacts = {
  async create(contactData) {
    if (!isHubSpotConfigured()) {
      console.log('📝 HubSpot not configured - contact not synced');
      return { data: null, error: null };
    }

    try {
      const properties = {
        email: contactData.email,
        firstname: contactData.firstName || contactData.fullName?.split(' ')[0] || '',
        lastname: contactData.lastName || contactData.fullName?.split(' ').slice(1).join(' ') || '',
        company: contactData.organizationName || contactData.company || '',
      };

      Object.keys(properties).forEach(key => {
        if (!properties[key]) delete properties[key];
      });

      const result = await hubspotRequest('/crm/v3/objects/contacts', {
        method: 'POST',
        body: JSON.stringify({ properties }),
      });

      console.log('✅ HubSpot contact created:', result.id);
      return { data: result, error: null };
    } catch (error) {
      if (error.message?.includes('409') || error.message?.includes('conflict')) {
        console.log('ℹ️ HubSpot contact already exists');
        return { data: null, error: null };
      }
      console.error('HubSpot create contact error:', error);
      return { data: null, error };
    }
  },

  async findByEmail(email) {
    if (!isHubSpotConfigured()) {
      return { data: null, error: null };
    }

    try {
      const result = await hubspotRequest('/crm/v3/objects/contacts/search', {
        method: 'POST',
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: 'email',
              operator: 'EQ',
              value: email,
            }],
          }],
        }),
      });

      return { data: result.results?.[0] || null, error: null };
    } catch (error) {
      console.error('HubSpot search error:', error);
      return { data: null, error };
    }
  },

  async upsert(contactData) {
    if (!isHubSpotConfigured()) {
      return { data: null, error: null };
    }

    const { data: existing } = await this.findByEmail(contactData.email);
    if (existing) {
      console.log('ℹ️ HubSpot contact exists:', existing.id);
      return { data: existing, error: null };
    }
    return await this.create(contactData);
  },
};

export const hubspotDeals = {
  async create(dealData, contactId = null) {
    if (!isHubSpotConfigured()) {
      return { data: null, error: null };
    }

    try {
      const properties = {
        dealname: dealData.name || `Demo Request - ${dealData.organizationName || 'New Lead'}`,
        pipeline: 'default',
        dealstage: 'appointmentscheduled',
        description: dealData.description || '',
      };

      Object.keys(properties).forEach(key => {
        if (!properties[key]) delete properties[key];
      });

      const requestBody = { properties };

      if (contactId) {
        requestBody.associations = [{
          to: { id: contactId },
          types: [{
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: 3,
          }],
        }];
      }

      const result = await hubspotRequest('/crm/v3/objects/deals', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      console.log('✅ HubSpot deal created:', result.id);
      return { data: result, error: null };
    } catch (error) {
      console.error('HubSpot create deal error:', error);
      return { data: null, error };
    }
  },
};

export async function syncDemoRequestToHubSpot(demoRequest, createDeal = true) {
  if (!isHubSpotConfigured()) {
    console.log('📝 HubSpot not configured - skipping sync');
    return { contact: null, deal: null, error: null };
  }

  try {
    const { data: contact, error: contactError } = await hubspotContacts.upsert({
      email: demoRequest.email,
      fullName: demoRequest.fullName,
      organizationName: demoRequest.organizationName,
      organizationType: demoRequest.organizationType,
      monthlyClaimVolume: demoRequest.monthlyClaimVolume,
      source: 'Website - Demo Request',
    });

    if (contactError) {
      return { contact: null, deal: null, error: contactError };
    }

    let deal = null;
    if (createDeal && contact) {
      const { data: dealData } = await hubspotDeals.create({
        name: `Demo Request - ${demoRequest.organizationName}`,
        description: `Organization Type: ${demoRequest.organizationType || 'N/A'}
Monthly Claim Volume: ${demoRequest.monthlyClaimVolume || 'N/A'}`,
      }, contact.id);
      deal = dealData;
    }

    return { contact, deal, error: null };
  } catch (error) {
    console.error('HubSpot sync error:', error);
    return { contact: null, deal: null, error };
  }
}

export default {
  isConfigured: isHubSpotConfigured,
  contacts: hubspotContacts,
  deals: hubspotDeals,
  syncDemoRequest: syncDemoRequestToHubSpot,
};

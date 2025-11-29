/**
 * HubSpot CRM Integration
 * 
 * This module provides integration with HubSpot CRM for:
 * - Creating contacts from demo requests
 * - Creating deals for sales pipeline
 * - Adding notes and tracking
 */

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

// Get HubSpot access token from environment
const getAccessToken = () => process.env.HUBSPOT_ACCESS_TOKEN;

/**
 * Check if HubSpot is configured
 * @returns {boolean}
 */
export function isHubSpotConfigured() {
  return !!getAccessToken();
}

/**
 * Make a request to HubSpot API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>}
 */
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

/**
 * HubSpot Contacts Service
 */
export const hubspotContacts = {
  /**
   * Create a new contact in HubSpot
   * @param {Object} contactData - Contact information
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
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
        phone: contactData.phone || '',
        website: contactData.website || '',
        // Custom properties (create these in HubSpot first)
        organization_type: contactData.organizationType || '',
        monthly_claim_volume: contactData.monthlyClaimVolume || '',
        lead_source: contactData.source || 'Website - Demo Request',
      };

      // Remove empty properties
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
      // Check if contact already exists (409 conflict)
      if (error.message?.includes('409') || error.message?.includes('conflict')) {
        console.log('ℹ️ HubSpot contact already exists, updating instead');
        return await this.updateByEmail(contactData.email, contactData);
      }
      
      console.error('HubSpot create contact error:', error);
      return { data: null, error };
    }
  },

  /**
   * Search for a contact by email
   * @param {string} email - Email address
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
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

      const contact = result.results?.[0] || null;
      return { data: contact, error: null };
    } catch (error) {
      console.error('HubSpot search contact error:', error);
      return { data: null, error };
    }
  },

  /**
   * Update a contact by email
   * @param {string} email - Email address
   * @param {Object} contactData - Updated contact data
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateByEmail(email, contactData) {
    if (!isHubSpotConfigured()) {
      return { data: null, error: null };
    }

    try {
      // First find the contact
      const { data: existingContact } = await this.findByEmail(email);
      
      if (!existingContact) {
        // Contact doesn't exist, create it
        return await this.create(contactData);
      }

      const properties = {
        firstname: contactData.firstName || contactData.fullName?.split(' ')[0],
        lastname: contactData.lastName || contactData.fullName?.split(' ').slice(1).join(' '),
        company: contactData.organizationName || contactData.company,
        organization_type: contactData.organizationType,
        monthly_claim_volume: contactData.monthlyClaimVolume,
      };

      // Remove undefined properties
      Object.keys(properties).forEach(key => {
        if (properties[key] === undefined) delete properties[key];
      });

      const result = await hubspotRequest(`/crm/v3/objects/contacts/${existingContact.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ properties }),
      });

      console.log('✅ HubSpot contact updated:', result.id);
      return { data: result, error: null };
    } catch (error) {
      console.error('HubSpot update contact error:', error);
      return { data: null, error };
    }
  },

  /**
   * Create or update a contact (upsert)
   * @param {Object} contactData - Contact information
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async upsert(contactData) {
    if (!isHubSpotConfigured()) {
      console.log('📝 HubSpot not configured - contact not synced');
      return { data: null, error: null };
    }

    try {
      // Try to find existing contact first
      const { data: existingContact } = await this.findByEmail(contactData.email);
      
      if (existingContact) {
        return await this.updateByEmail(contactData.email, contactData);
      } else {
        return await this.create(contactData);
      }
    } catch (error) {
      console.error('HubSpot upsert contact error:', error);
      return { data: null, error };
    }
  },
};

/**
 * HubSpot Deals Service
 */
export const hubspotDeals = {
  /**
   * Create a new deal in HubSpot
   * @param {Object} dealData - Deal information
   * @param {string} contactId - Associated contact ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async create(dealData, contactId = null) {
    if (!isHubSpotConfigured()) {
      console.log('📝 HubSpot not configured - deal not created');
      return { data: null, error: null };
    }

    try {
      const properties = {
        dealname: dealData.name || `Demo Request - ${dealData.organizationName || 'New Lead'}`,
        pipeline: dealData.pipeline || 'default',
        dealstage: dealData.stage || 'appointmentscheduled',
        amount: dealData.amount || '',
        description: dealData.description || `Demo request from ${dealData.organizationName || 'website'}`,
      };

      // Remove empty properties
      Object.keys(properties).forEach(key => {
        if (!properties[key]) delete properties[key];
      });

      const requestBody = { properties };

      // Associate with contact if provided
      if (contactId) {
        requestBody.associations = [{
          to: { id: contactId },
          types: [{
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: 3, // Deal to Contact
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

/**
 * HubSpot Notes Service
 */
export const hubspotNotes = {
  /**
   * Add a note to a contact
   * @param {string} contactId - Contact ID
   * @param {string} noteBody - Note content
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async addToContact(contactId, noteBody) {
    if (!isHubSpotConfigured()) {
      return { data: null, error: null };
    }

    try {
      const result = await hubspotRequest('/crm/v3/objects/notes', {
        method: 'POST',
        body: JSON.stringify({
          properties: {
            hs_note_body: noteBody,
            hs_timestamp: new Date().toISOString(),
          },
          associations: [{
            to: { id: contactId },
            types: [{
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 202, // Note to Contact
            }],
          }],
        }),
      });

      return { data: result, error: null };
    } catch (error) {
      console.error('HubSpot add note error:', error);
      return { data: null, error };
    }
  },
};

/**
 * Sync a demo request to HubSpot
 * Creates contact and optionally a deal
 * @param {Object} demoRequest - Demo request data
 * @param {boolean} createDeal - Whether to create a deal
 * @returns {Promise<{contact: Object|null, deal: Object|null, error: Error|null}>}
 */
export async function syncDemoRequestToHubSpot(demoRequest, createDeal = true) {
  if (!isHubSpotConfigured()) {
    console.log('📝 HubSpot not configured - demo request not synced');
    return { contact: null, deal: null, error: null };
  }

  try {
    // Create or update contact
    const { data: contact, error: contactError } = await hubspotContacts.upsert({
      email: demoRequest.email,
      fullName: demoRequest.fullName,
      organizationName: demoRequest.organizationName,
      organizationType: demoRequest.organizationType,
      monthlyClaimVolume: demoRequest.monthlyClaimVolume,
      source: 'Website - Demo Request',
    });

    if (contactError) {
      console.error('Failed to sync contact to HubSpot:', contactError);
      return { contact: null, deal: null, error: contactError };
    }

    let deal = null;
    if (createDeal && contact) {
      // Create deal associated with contact
      const { data: dealData, error: dealError } = await hubspotDeals.create({
        name: `Demo Request - ${demoRequest.organizationName}`,
        organizationName: demoRequest.organizationName,
        description: `Demo request submitted via website.
Organization Type: ${demoRequest.organizationType || 'Not specified'}
Monthly Claim Volume: ${demoRequest.monthlyClaimVolume || 'Not specified'}`,
      }, contact.id);

      if (dealError) {
        console.error('Failed to create deal in HubSpot:', dealError);
      } else {
        deal = dealData;
      }
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
  notes: hubspotNotes,
  syncDemoRequest: syncDemoRequestToHubSpot,
};

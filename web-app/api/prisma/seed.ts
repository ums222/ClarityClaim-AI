import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo-health" },
    update: {},
    create: {
      name: "Demo Healthcare System",
      slug: "demo-health",
    },
  });
  console.log("✅ Tenant created:", tenant.name);

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "dev@clarityclaim.ai" },
    update: {},
    create: {
      email: "dev@clarityclaim.ai",
      name: "Dev Billing Specialist",
      role: "BILLING_SPECIALIST",
      tenantId: tenant.id,
    },
  });
  console.log("✅ User created:", user.email);

  // Create demo payer
  const payer = await prisma.payer.upsert({
    where: { payerCode: "BCBS-001" },
    update: {},
    create: {
      name: "Blue Cross Blue Shield",
      payerCode: "BCBS-001",
    },
  });
  console.log("✅ Payer created:", payer.name);

  // Create demo facility
  const facility = await prisma.facility.create({
    data: {
      name: "Main Hospital Campus",
      npi: "1234567890",
      tenantId: tenant.id,
    },
  });
  console.log("✅ Facility created:", facility.name);

  // Create demo claims
  const claims = await Promise.all([
    prisma.claim.create({
      data: {
        claimNumber: "CLM-2024-001",
        tenantId: tenant.id,
        facilityId: facility.id,
        payerId: payer.id,
        amount: 15000,
        status: "DENIED",
        denialReason: "Medical necessity not established - Missing prior authorization",
        serviceDate: new Date("2024-01-15"),
      },
    }),
    prisma.claim.create({
      data: {
        claimNumber: "CLM-2024-002",
        tenantId: tenant.id,
        facilityId: facility.id,
        payerId: payer.id,
        amount: 8500,
        status: "PAID",
        serviceDate: new Date("2024-02-01"),
      },
    }),
    prisma.claim.create({
      data: {
        claimNumber: "CLM-2024-003",
        tenantId: tenant.id,
        facilityId: facility.id,
        payerId: payer.id,
        amount: 22000,
        status: "DENIED",
        denialReason: "Duplicate claim submission",
        serviceDate: new Date("2024-02-15"),
      },
    }),
    prisma.claim.create({
      data: {
        claimNumber: "CLM-2024-004",
        tenantId: tenant.id,
        facilityId: facility.id,
        payerId: payer.id,
        amount: 45000,
        status: "APPEAL_DRAFT",
        denialReason: "Service not covered under plan",
        serviceDate: new Date("2024-03-01"),
      },
    }),
    prisma.claim.create({
      data: {
        claimNumber: "CLM-2024-005",
        tenantId: tenant.id,
        facilityId: facility.id,
        payerId: payer.id,
        amount: 12500,
        status: "PAID",
        serviceDate: new Date("2024-03-10"),
      },
    }),
    prisma.claim.create({
      data: {
        claimNumber: "CLM-2024-006",
        tenantId: tenant.id,
        facilityId: facility.id,
        amount: 33000,
        status: "PENDING_SUBMISSION",
        serviceDate: new Date("2024-03-20"),
      },
    }),
  ]);
  console.log(`✅ Created ${claims.length} demo claims`);

  // Create equity signals for some claims
  const deniedClaims = claims.filter((c) => c.status === "DENIED");
  for (const claim of deniedClaims) {
    await prisma.equitySignal.createMany({
      data: [
        {
          claimId: claim.id,
          dimension: "geography",
          value: "rural",
          riskScore: 0.65,
        },
        {
          claimId: claim.id,
          dimension: "income_bracket",
          value: "low",
          riskScore: 0.72,
        },
      ],
    });
  }
  console.log("✅ Created equity signals for denied claims");

  // Create a demo appeal
  const appeal = await prisma.appeal.create({
    data: {
      claimId: claims[0].id,
      status: "DRAFT",
      draftText:
        "Dear Claims Review Committee,\n\nWe are writing to appeal the denial of claim CLM-2024-001. The medical necessity for this procedure was clearly established through the patient's documented history...",
      createdById: user.id,
      aiModelVersion: "clarityclaim-appeals-v1.0",
    },
  });
  console.log("✅ Created demo appeal");

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📋 Summary:");
  console.log(`   Tenant ID: ${tenant.id}`);
  console.log(`   User ID: ${user.id}`);
  console.log(`   User Email: ${user.email}`);
  console.log(`   Claims: ${claims.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

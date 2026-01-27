import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@opexsales.com' },
    update: {},
    create: {
      email: 'admin@opexsales.com',
      name: 'Admin User',
      password: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@opexsales.com' },
    update: {},
    create: {
      email: 'manager@opexsales.com',
      name: 'Sales Manager',
      password: await bcrypt.hash('password123', 10),
      role: 'MANAGER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager',
    },
  });

  const salesRepUser = await prisma.user.upsert({
    where: { email: 'salesrep@opexsales.com' },
    update: {},
    create: {
      email: 'salesrep@opexsales.com',
      name: 'Sales Representative',
      password: await bcrypt.hash('password123', 10),
      role: 'SALES_REP',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SalesRep',
    },
  });

  // Create demo leads for the sales rep
  const leads = await Promise.all([
    prisma.lead.upsert({
      where: { email: 'john@acme.com' },
      update: {},
      create: {
        email: 'john@acme.com',
        name: 'John Smith',
        phone: '+1-555-0101',
        company: 'Acme Corporation',
        title: 'Sales Director',
        location: 'San Francisco, CA',
        status: 'CONTACTED',
        source: 'LinkedIn',
        score: 75,
        userId: salesRepUser.id,
      },
    }),
    prisma.lead.upsert({
      where: { email: 'sarah@techstart.io' },
      update: {},
      create: {
        email: 'sarah@techstart.io',
        name: 'Sarah Johnson',
        phone: '+1-555-0102',
        company: 'TechStart Inc',
        title: 'CEO',
        location: 'Austin, TX',
        status: 'QUALIFIED',
        source: 'Website',
        score: 85,
        userId: salesRepUser.id,
      },
    }),
    prisma.lead.upsert({
      where: { email: 'mike@globaltrade.com' },
      update: {},
      create: {
        email: 'mike@globaltrade.com',
        name: 'Michael Chen',
        phone: '+1-555-0103',
        company: 'Global Trade Solutions',
        title: 'Operations Manager',
        location: 'New York, NY',
        status: 'NEGOTIATION',
        source: 'Referral',
        score: 90,
        userId: salesRepUser.id,
      },
    }),
  ]);

  // Create a demo campaign
  const campaign = await prisma.campaign.create({
    data: {
      name: 'Q1 2024 Enterprise Push',
      description: 'Targeting enterprise companies in tech and finance',
      status: 'ACTIVE',
      template: 'enterprise_outreach_v1',
      recipients: 3,
      userId: salesRepUser.id,
    },
  });

  // Add leads to campaign
  await Promise.all([
    prisma.campaignLead.create({
      data: {
        campaignId: campaign.id,
        leadId: leads[0].id,
        status: 'SENT',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
    prisma.campaignLead.create({
      data: {
        campaignId: campaign.id,
        leadId: leads[1].id,
        status: 'OPENED',
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
    prisma.campaignLead.create({
      data: {
        campaignId: campaign.id,
        leadId: leads[2].id,
        status: 'CLICKED',
        sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
    }),
  ]);

  // Create demo messages
  await Promise.all([
    prisma.message.create({
      data: {
        content: 'Hi John, I wanted to reach out regarding our enterprise solutions...',
        subject: 'Enterprise Solutions for Acme',
        channel: 'EMAIL',
        status: 'DELIVERED',
        userId: salesRepUser.id,
        leadId: leads[0].id,
        campaignId: campaign.id,
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.message.create({
      data: {
        content: 'Hi Sarah, Excited to connect with you about our platform...',
        subject: 'Partnership Opportunity for TechStart',
        channel: 'EMAIL',
        status: 'OPENED',
        userId: salesRepUser.id,
        leadId: leads[1].id,
        campaignId: campaign.id,
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        openedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    }),
  ]);

  // Create demo events
  await Promise.all([
    prisma.event.create({
      data: {
        type: 'EMAIL_SENT',
        source: 'sendgrid',
        leadId: leads[0].id,
        campaignId: campaign.id,
        metadata: { templateId: 'enterprise_v1' },
      },
    }),
    prisma.event.create({
      data: {
        type: 'EMAIL_OPENED',
        source: 'sendgrid',
        leadId: leads[1].id,
        campaignId: campaign.id,
        metadata: { ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0' },
      },
    }),
    prisma.event.create({
      data: {
        type: 'EMAIL_CLICKED',
        source: 'sendgrid',
        leadId: leads[2].id,
        campaignId: campaign.id,
        metadata: { url: 'https://opexsales.com/demo', linkName: 'Schedule Demo' },
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('📋 Demo Users:');
  console.log(`   Admin: admin@opexsales.com / password123`);
  console.log(`   Manager: manager@opexsales.com / password123`);
  console.log(`   Sales Rep: salesrep@opexsales.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

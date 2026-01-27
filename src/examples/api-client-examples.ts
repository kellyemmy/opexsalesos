/**
 * API Client Examples for OpexSales Backend
 * 
 * This file demonstrates how to use the backend API from the frontend.
 * The Axios client is configured in src/lib/api.ts with JWT auto-refresh.
 */

import api from '@/lib/api';

// ============================================================================
// AUTHENTICATION EXAMPLES
// ============================================================================

/**
 * Login with email and password
 * Response includes accessToken (in JSON) and sets refreshToken in httpOnly cookie
 */
export async function loginExample() {
  try {
    const response = await api.post('/auth/login', {
      email: 'salesrep@opexsales.com',
      password: 'password123',
    });

    console.log('Login successful!');
    console.log('User:', response.data.user);
    console.log('Access Token:', response.data.accessToken);
    // Refresh token is automatically stored in httpOnly cookie

    return response.data;
  } catch (error: any) {
    console.error('Login failed:', error.response?.data?.message);
  }
}

/**
 * Get current authenticated user
 * Requires valid JWT in Authorization header (auto-added by Axios)
 */
export async function getCurrentUserExample() {
  try {
    const response = await api.get('/auth/me');
    console.log('Current user:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch user:', error.response?.data?.message);
  }
}

/**
 * Logout - clears refresh token cookie on backend
 */
export async function logoutExample() {
  try {
    await api.post('/auth/logout');
    console.log('Logged out successfully');
  } catch (error: any) {
    console.error('Logout failed:', error.response?.data?.message);
  }
}

// ============================================================================
// LEADS MANAGEMENT EXAMPLES
// ============================================================================

/**
 * Get all leads for current user
 */
export async function getLeadsExample() {
  try {
    const response = await api.get('/leads');
    console.log('Leads:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch leads:', error.response?.data?.message);
  }
}

/**
 * Get leads filtered by status
 * Status options: NEW, CONTACTED, QUALIFIED, NEGOTIATION, CLOSED_WON, CLOSED_LOST
 */
export async function getLeadsByStatusExample(status: string) {
  try {
    const response = await api.get('/leads', {
      params: { status },
    });
    console.log(`${status} leads:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch leads:', error.response?.data?.message);
  }
}

/**
 * Get a specific lead with all related data
 */
export async function getLeadDetailsExample(leadId: string) {
  try {
    const response = await api.get(`/leads/${leadId}`);
    console.log('Lead details:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch lead:', error.response?.data?.message);
  }
}

/**
 * Create a new lead
 */
export async function createLeadExample() {
  try {
    const response = await api.post('/leads', {
      email: 'john@acme.com',
      name: 'John Smith',
      phone: '+1-555-0101',
      company: 'Acme Corporation',
      title: 'Sales Director',
      location: 'San Francisco, CA',
      source: 'LinkedIn', // Where the lead came from
    });
    console.log('Lead created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create lead:', error.response?.data?.message);
  }
}

/**
 * Update an existing lead
 */
export async function updateLeadExample(leadId: string) {
  try {
    const response = await api.put(`/leads/${leadId}`, {
      status: 'QUALIFIED', // Update status
      score: 85, // Update lead score
      // Can update any lead field
    });
    console.log('Lead updated:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update lead:', error.response?.data?.message);
  }
}

/**
 * Delete a lead
 */
export async function deleteLeadExample(leadId: string) {
  try {
    const response = await api.delete(`/leads/${leadId}`);
    console.log('Lead deleted');
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete lead:', error.response?.data?.message);
  }
}

// ============================================================================
// CAMPAIGNS MANAGEMENT EXAMPLES
// ============================================================================

/**
 * Create a new campaign
 */
export async function createCampaignExample() {
  try {
    const response = await api.post('/campaigns', {
      name: 'Q1 2024 Enterprise Push',
      description: 'Targeting enterprise companies in tech and finance',
      template: 'enterprise_outreach_v1',
      subject: 'Enterprise Solution Inquiry', // Email subject template
    });
    console.log('Campaign created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create campaign:', error.response?.data?.message);
  }
}

/**
 * Get all campaigns for current user
 */
export async function getCampaignsExample() {
  try {
    const response = await api.get('/campaigns');
    console.log('Campaigns:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch campaigns:', error.response?.data?.message);
  }
}

/**
 * Get campaign details with all leads
 */
export async function getCampaignDetailsExample(campaignId: string) {
  try {
    const response = await api.get(`/campaigns/${campaignId}`);
    console.log('Campaign details:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch campaign:', error.response?.data?.message);
  }
}

/**
 * Update campaign status
 * Status options: DRAFT, SCHEDULED, ACTIVE, PAUSED, COMPLETED, ARCHIVED
 */
export async function updateCampaignStatusExample(campaignId: string, status: string) {
  try {
    const response = await api.put(`/campaigns/${campaignId}`, {
      status,
    });
    console.log('Campaign updated:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update campaign:', error.response?.data?.message);
  }
}

/**
 * Add a lead to a campaign
 */
export async function addLeadToCampaignExample(campaignId: string, leadId: string) {
  try {
    const response = await api.post(`/campaigns/${campaignId}/leads/${leadId}`);
    console.log('Lead added to campaign:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to add lead:', error.response?.data?.message);
  }
}

/**
 * Remove lead from campaign
 */
export async function removeLeadFromCampaignExample(campaignId: string, leadId: string) {
  try {
    const response = await api.delete(`/campaigns/${campaignId}/leads/${leadId}`);
    console.log('Lead removed from campaign');
    return response.data;
  } catch (error: any) {
    console.error('Failed to remove lead:', error.response?.data?.message);
  }
}

/**
 * Delete a campaign
 */
export async function deleteCampaignExample(campaignId: string) {
  try {
    const response = await api.delete(`/campaigns/${campaignId}`);
    console.log('Campaign deleted');
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete campaign:', error.response?.data?.message);
  }
}

// ============================================================================
// MESSAGES & CONVERSATIONS EXAMPLES
// ============================================================================

/**
 * Get all messages/conversations for a specific lead
 */
export async function getLeadConversationExample(leadId: string) {
  try {
    const response = await api.get(`/messages/leads/${leadId}`);
    console.log('Lead conversation:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch conversation:', error.response?.data?.message);
  }
}

/**
 * Send a message to a lead
 */
export async function sendMessageExample(leadId: string) {
  try {
    const response = await api.post(`/messages/leads/${leadId}`, {
      content: 'Hi John, I wanted to reach out about our enterprise solutions...',
      subject: 'Enterprise Solutions for Acme',
      channel: 'EMAIL', // EMAIL, SMS, LINKEDIN, PHONE, WHATSAPP
      campaignId: 'campaign-123', // Optional - link to campaign
    });
    console.log('Message sent:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to send message:', error.response?.data?.message);
  }
}

/**
 * Get all messages in a campaign
 */
export async function getCampaignMessagesExample(campaignId: string) {
  try {
    const response = await api.get(`/messages/campaigns/${campaignId}`);
    console.log('Campaign messages:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch messages:', error.response?.data?.message);
  }
}

/**
 * Update message status
 * Status options: PENDING, SENT, DELIVERED, OPENED, CLICKED, REPLIED, BOUNCED, FAILED
 */
export async function updateMessageStatusExample(messageId: string, status: string) {
  try {
    const response = await api.put(`/messages/${messageId}/status`, {
      status,
    });
    console.log('Message status updated:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update status:', error.response?.data?.message);
  }
}

// ============================================================================
// EVENTS & TRACKING EXAMPLES
// ============================================================================

/**
 * Get all events for a specific lead
 */
export async function getLeadEventsExample(leadId: string) {
  try {
    const response = await api.get('/events', {
      params: { leadId },
    });
    console.log('Lead events:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch events:', error.response?.data?.message);
  }
}

/**
 * Get all events in a campaign
 */
export async function getCampaignEventsExample(campaignId: string) {
  try {
    const response = await api.get(`/events/campaigns/${campaignId}`);
    console.log('Campaign events:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch events:', error.response?.data?.message);
  }
}

// ============================================================================
// AI ENDPOINTS EXAMPLES
// ============================================================================

/**
 * Generate email copy using AI
 * Returns generated content, token usage, and estimated cost
 */
export async function generateEmailCopyExample() {
  try {
    const response = await api.post('/ai/write', {
      topic: 'B2B SaaS platform demo',
      leadName: 'John Smith',
      companyName: 'Acme Corp',
      tone: 'professional', // professional, casual, formal, friendly
    });

    console.log('Generated content:', response.data.response);
    console.log('Tokens used:', response.data.tokens);
    console.log('Estimated cost:', response.data.cost);

    return response.data;
  } catch (error: any) {
    console.error('Failed to generate content:', error.response?.data?.message);
  }
}

/**
 * Generate a multi-email sequence
 */
export async function generateEmailSequenceExample() {
  try {
    const response = await api.post('/ai/sequence', {
      leadName: 'John Smith',
      companyName: 'Acme Corp',
      productSummary: 'AI-powered sales engagement platform with email, SMS, and CRM integration',
      numberOfEmails: 5, // Default: 5
    });

    console.log('Generated sequence:', response.data.response);
    console.log('Total tokens:', response.data.tokens);
    console.log('Total cost:', response.data.cost);

    return response.data;
  } catch (error: any) {
    console.error('Failed to generate sequence:', error.response?.data?.message);
  }
}

/**
 * Summarize lead interactions
 */
export async function summarizeLeadInteractionsExample() {
  try {
    const response = await api.post('/ai/summarize', {
      leadName: 'John Smith',
      interactions: [
        'Opened first email on Jan 15, clicked on scheduling link',
        'Replied to second email asking about pricing',
        'Attended webinar on Jan 20, engaged with Q&A',
        'Downloaded case study on enterprise implementation',
      ],
    });

    console.log('Summary:', response.data.response);
    console.log('Tokens used:', response.data.tokens);

    return response.data;
  } catch (error: any) {
    console.error('Failed to summarize:', error.response?.data?.message);
  }
}

/**
 * Get AI insights and next-step recommendations
 */
export async function getLeadInsightsExample() {
  try {
    const response = await api.post('/ai/insights', {
      leadName: 'John Smith',
      company: 'Acme Corporation',
      history:
        'Met at trade show, has been engaged with content for 3 weeks, attended demo',
      currentStatus: 'QUALIFIED - considering purchase',
    });

    console.log('AI Insights:', response.data.response);
    console.log('Recommended next steps provided');

    return response.data;
  } catch (error: any) {
    console.error('Failed to get insights:', error.response?.data?.message);
  }
}

/**
 * Check content for compliance issues
 */
export async function checkComplianceExample() {
  try {
    const response = await api.post('/ai/compliance', {
      content: `
        Subject: Limited Time Offer - 50% Off

        Hi John,

        For a limited time, we're offering 50% off our enterprise plan. 
        This offer expires tomorrow at midnight.

        Not interested? Click here to unsubscribe.

        Best regards,
        Sales Team
      `,
      jurisdiction: 'US', // US, EU, UK, etc.
    });

    console.log('Compliance review:', response.data.response);
    console.log('Any issues flagged?');

    return response.data;
  } catch (error: any) {
    console.error('Failed to check compliance:', error.response?.data?.message);
  }
}

// ============================================================================
// INTEGRATION EXAMPLE: Complete Workflow
// ============================================================================

/**
 * Complete workflow example: Create lead → Create campaign → Send AI-generated email
 */
export async function completeWorkflowExample() {
  console.log('🚀 Starting complete workflow...\n');

  try {
    // 1. Create a new lead
    console.log('1️⃣ Creating lead...');
    const leadResponse = await api.post('/leads', {
      email: 'prospect@newcompany.com',
      name: 'Jane Prospect',
      company: 'New Company Inc',
      title: 'VP Sales',
      location: 'Boston, MA',
      source: 'LinkedIn',
    });
    const leadId = leadResponse.data.id;
    console.log('✅ Lead created:', leadId, '\n');

    // 2. Generate email content using AI
    console.log('2️⃣ Generating email content with AI...');
    const emailResponse = await api.post('/ai/write', {
      topic: 'Sales engagement platform implementation',
      leadName: 'Jane',
      companyName: 'New Company Inc',
      tone: 'professional',
    });
    const emailContent = emailResponse.data.response;
    console.log('✅ Email generated\n');

    // 3. Create a campaign
    console.log('3️⃣ Creating campaign...');
    const campaignResponse = await api.post('/campaigns', {
      name: 'New Company Outreach - Q1',
      description: 'Initial outreach to VP Sales at New Company Inc',
    });
    const campaignId = campaignResponse.data.id;
    console.log('✅ Campaign created:', campaignId, '\n');

    // 4. Add lead to campaign
    console.log('4️⃣ Adding lead to campaign...');
    await api.post(`/campaigns/${campaignId}/leads/${leadId}`);
    console.log('✅ Lead added to campaign\n');

    // 5. Send message
    console.log('5️⃣ Sending message...');
    const messageResponse = await api.post(`/messages/leads/${leadId}`, {
      content: emailContent,
      subject: 'Sales Engagement Platform - New Company Opportunity',
      channel: 'EMAIL',
      campaignId,
    });
    console.log('✅ Message sent:', messageResponse.data.id, '\n');

    console.log('🎉 Workflow complete!\n');

    return {
      leadId,
      campaignId,
      messageId: messageResponse.data.id,
    };
  } catch (error: any) {
    console.error('❌ Workflow failed:', error.response?.data?.message);
  }
}

export default {
  loginExample,
  getCurrentUserExample,
  logoutExample,
  getLeadsExample,
  getLeadsByStatusExample,
  getLeadDetailsExample,
  createLeadExample,
  updateLeadExample,
  deleteLeadExample,
  createCampaignExample,
  getCampaignsExample,
  getCampaignDetailsExample,
  updateCampaignStatusExample,
  addLeadToCampaignExample,
  removeLeadFromCampaignExample,
  deleteCampaignExample,
  getLeadConversationExample,
  sendMessageExample,
  getCampaignMessagesExample,
  updateMessageStatusExample,
  getLeadEventsExample,
  getCampaignEventsExample,
  generateEmailCopyExample,
  generateEmailSequenceExample,
  summarizeLeadInteractionsExample,
  getLeadInsightsExample,
  checkComplianceExample,
  completeWorkflowExample,
};

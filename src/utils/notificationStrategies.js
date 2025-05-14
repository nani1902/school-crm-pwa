// src/utils/notificationStrategies.js

/**
 * This file contains strategies for different notification types.
 * Each strategy defines when and how notifications should be triggered.
 */

// Strategy for new lead notifications
export const newLeadStrategy = {
  // Who should be notified
  recipients: ['Admin', 'Admission Coordinator'], // Roles that should receive this notification
  
  // Generate notification content
  createNotification: (lead) => ({
    title: 'New Lead Added',
    body: `A new lead (${lead.full_name}) has been added to the system.`,
    icon: 'person_add',
    url: `/leads/${lead.id}`,
    data: {
      type: 'new_lead',
      leadId: lead.id
    }
  }),
  
  // Should this notification be triggered?
  shouldTrigger: (lead, previousState) => {
    // This should trigger when a new lead is created
    return !previousState; // No previous state means it's a new lead
  }
};

// Strategy for lead status change notifications
export const leadStatusChangeStrategy = {
  recipients: ['Admin'],
  
  createNotification: (lead, previousState) => {
    const statusMap = {
      'Payment Verified': 'payment_verified',
      'Converted': 'converted'
    };
    
    // Default notification
    let notification = {
      title: 'Lead Status Changed',
      body: `Lead "${lead.full_name}" status changed from "${previousState.status}" to "${lead.status}".`,
      icon: 'update',
      url: `/leads/${lead.id}`,
      data: {
        type: 'status_change',
        leadId: lead.id,
        oldStatus: previousState.status,
        newStatus: lead.status
      }
    };
    
    // Special case for payment verification
    if (lead.status === 'Payment Verified' && previousState.status === 'Payment Pending') {
      notification = {
        title: 'Payment Verified',
        body: `Payment has been verified for lead "${lead.full_name}". Ready for onboarding.`,
        icon: 'payments',
        url: `/leads/${lead.id}`,
        data: {
          type: 'payment_verified',
          leadId: lead.id
        }
      };
    }
    
    // Special case for conversion
    if (lead.status === 'Converted') {
      notification = {
        title: 'Lead Converted to Student',
        body: `Lead "${lead.full_name}" has been successfully converted to a student.`,
        icon: 'school',
        url: `/leads/${lead.id}`,
        data: {
          type: 'converted',
          leadId: lead.id
        }
      };
    }
    
    return notification;
  },
  
  shouldTrigger: (lead, previousState) => {
    // Only trigger if status has changed
    if (!previousState || lead.status === previousState.status) {
      return false;
    }
    
    // Important status changes that should trigger notifications
    const notifyStatuses = [
      'Payment Pending',
      'Payment Verified', 
      'Converted',
      'Visit Scheduled',
      'Pending Evaluation'
    ];
    
    return notifyStatuses.includes(lead.status);
  }
};

// Strategy for unassigned lead notifications
export const unassignedLeadStrategy = {
  recipients: ['Admin'],
  
  createNotification: (lead) => ({
    title: 'Unassigned Lead',
    body: `Lead "${lead.full_name}" is currently unassigned. Please assign a counselor.`,
    icon: 'assignment_late',
    url: `/leads/${lead.id}`,
    data: {
      type: 'unassigned_lead',
      leadId: lead.id
    }
  }),
  
  shouldTrigger: (lead, previousState) => {
    // New lead with no assigned counselor
    if (!lead.assigned_counselor) {
      // If it was previously assigned but now isn't
      if (previousState && previousState.assigned_counselor) {
        return true;
      }
      
      // If it's a new lead (no previous state)
      if (!previousState) {
        // Wait a bit before sending this notification to give time for assignment
        // This logic would typically be handled by the backend with a delay
        return true;
      }
    }
    
    return false;
  }
};

// Strategy for lead assignment notifications
export const leadAssignmentStrategy = {
  recipients: [], // This is dynamic, based on who's assigned
  
  createNotification: (lead, previousState) => ({
    title: 'New Lead Assigned',
    body: `Lead "${lead.full_name}" has been assigned to you.`,
    icon: 'assignment_ind',
    url: `/leads/${lead.id}`,
    data: {
      type: 'lead_assigned',
      leadId: lead.id
    }
  }),
  
  shouldTrigger: (lead, previousState) => {
    // Check if this lead was just assigned to someone
    if (lead.assigned_counselor) {
      // No previous state or no previous assignment
      if (!previousState || !previousState.assigned_counselor) {
        return true;
      }
      
      // Assignment changed to a different counselor
      if (previousState.assigned_counselor.id !== lead.assigned_counselor.id) {
        return true;
      }
    }
    
    return false;
  },
  
  // Additional function to determine specific recipients
  getRecipients: (lead) => {
    if (lead.assigned_counselor) {
      return [lead.assigned_counselor.id]; // Send to the assigned counselor
    }
    return [];
  }
};

// Strategy for follow-up reminder notifications
export const followUpReminderStrategy = {
  recipients: [], // Dynamic based on who needs to follow up
  
  createNotification: (lead) => ({
    title: 'Follow-up Reminder',
    body: `No interaction has been logged for lead "${lead.full_name}" in the last 24 hours.`,
    icon: 'notification_important',
    url: `/leads/${lead.id}/log`,
    data: {
      type: 'follow_up_reminder',
      leadId: lead.id
    }
  }),
  
  shouldTrigger: (lead, previousState, context) => {
    // Check if lead has an assigned counselor
    if (!lead.assigned_counselor) {
      return false;
    }
    
    // Check if the lead has been contacted recently
    const lastContactTime = lead.last_contact_date ? new Date(lead.last_contact_date) : null;
    
    if (!lastContactTime) {
      // If lead was assigned more than 24 hours ago but never contacted
      const assignedTime = lead.assigned_date ? new Date(lead.assigned_date) : null;
      if (assignedTime) {
        const hoursSinceAssigned = (new Date() - assignedTime) / (1000 * 60 * 60);
        return hoursSinceAssigned >= 24;
      }
      return false;
    }
    
    // Check if it's been more than 24 hours since last contact
    const hoursSinceLastContact = (new Date() - lastContactTime) / (1000 * 60 * 60);
    return hoursSinceLastContact >= 24;
  },
  
  getRecipients: (lead) => {
    return lead.assigned_counselor ? [lead.assigned_counselor.id] : [];
  }
};

// Strategy for visit reminder notifications
export const visitReminderStrategy = {
  recipients: [], // Dynamic based on who's responsible
  
  createNotification: (lead, previousState, context) => {
    const appointment = context.appointment;
    return {
      title: 'Upcoming Appointment',
      body: `Reminder: Appointment with "${lead.full_name}" scheduled in 1 hour.`,
      icon: 'event',
      url: `/leads/${lead.id}`,
      data: {
        type: 'visit_reminder',
        leadId: lead.id,
        appointmentId: appointment.id
      }
    };
  },
  
  shouldTrigger: (lead, previousState, context) => {
    // This would typically be handled by a scheduled job on the backend
    // that checks for upcoming appointments and sends notifications
    // For demonstration purposes, we'll include the logic here
    
    if (!context || !context.appointment) {
      return false;
    }
    
    const appointment = context.appointment;
    const appointmentTime = new Date(appointment.appointment_date + ' ' + appointment.appointment_time);
    const currentTime = new Date();
    
    // Calculate time difference in hours
    const hoursDifference = (appointmentTime - currentTime) / (1000 * 60 * 60);
    
    // Send notification 1 hour before appointment
    return hoursDifference > 0 && hoursDifference <= 1;
  },
  
  getRecipients: (lead, context) => {
    if (!lead.assigned_counselor) {
      return [];
    }
    
    return [lead.assigned_counselor.id];
  }
};

// Export all strategies as a collection
export const notificationStrategies = [
  newLeadStrategy,
  leadStatusChangeStrategy,
  unassignedLeadStrategy,
  leadAssignmentStrategy,
  followUpReminderStrategy,
  visitReminderStrategy
];

// Helper function to process lead changes and trigger appropriate notifications
export const processLeadChange = (lead, previousState, context = {}) => {
  const notifications = [];
  
  // Apply each strategy
  for (const strategy of notificationStrategies) {
    if (strategy.shouldTrigger(lead, previousState, context)) {
      const notification = strategy.createNotification(lead, previousState, context);
      
      // Determine recipients
      let recipients = strategy.recipients || [];
      
      // If strategy has a dynamic recipient getter
      if (strategy.getRecipients) {
        recipients = strategy.getRecipients(lead, context);
      }
      
      // Add recipients to notification
      notification.recipients = recipients;
      
      notifications.push(notification);
    }
  }
  
  return notifications;
};
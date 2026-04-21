export const en = {
  title: 'BUILD YOUR PROCESS',
  desc: 'Customize the service for your business in a few clicks. Combine modules like a builder. Optimize processes effortlessly: it\'s easy with us.',
  cards: {
    queue: { 
      title: 'Online Queue', 
      features: ["1-click status control", "SMS/push templates for clients", "Order archive with filters", "POS synchronization"] 
    },
    pager: { 
      title: 'Online Pager', 
      features: ["1-click status control", "SMS/push templates for clients", "Order archive with filters", "POS synchronization"] 
    },
    soon: { title: 'Soon' }
  },
  how_it_works: 'How it works',
  zero_state_info: 'To allow clients to join the queue and place orders, you need to select a plan for this location.',
  btn_reg: 'Start Registration',
  steps_queue: [
    { id: '01', title: 'Scan QR and join the queue', content: 'Client scans QR at the entrance or selects a service on the terminal. They instantly get an electronic ticket and see their place.' },
    { id: '02', title: 'Waiting for their turn', content: 'Client can leave — the system calculates the estimated wait time. A notification will be sent 5 minutes before the appointment.' },
    { id: '03', title: 'Calling the client and processing', content: 'Manager calls the next client in one click. Client receives a Push notification or SMS with the window number.' },
    { id: '04', title: 'Completion', content: 'Work is completed. Ticket status changes to "Served".', note: 'After service, the client is asked to leave a review. This helps improve the service.' }
  ],
  steps_pager: [
    { id: '01', title: 'Order placement and pager issuance', content: 'When placing an order, the cashier issues a pager or asks to scan the receipt\'s QR code.' },
    { id: '02', title: 'Cooking and status control', content: 'Chefs see the order on the screen. You can track cooking time. Statuses change in one click.' },
    { id: '03', title: 'Ready notification', content: 'When the order is ready, an employee presses a button. The client\'s pager vibrates, or a Push notification is sent.' },
    { id: '04', title: 'Order pickup', content: 'Client picks up the order. The system records the exact service time for statistics.' }
  ]
};
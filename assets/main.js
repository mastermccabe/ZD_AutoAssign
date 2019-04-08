$(function(){


  // Store things like this as a constant
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-
  // const GROUP_IDS = [
  //   360001785154, // Group Name Here
  //   360002693173  // Group Name Here
  // ];
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-


  // Zendesk Client
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-
  const CLIENT = ZAFClient.init();
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-


  // Functions
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-

  // Invoke
  // ========================================================
  CLIENT.invoke('hide');
  // ========================================================


  // Get Ticket Assignee and Current User
  // ========================================================
  CLIENT.get(['ticket.assignee.user.id','ticket.assignee.group.id','currentUser']).then(function(data){


    let currentUser = data['currentUser'];
    let assigneeId = data['ticket.assignee.user.id'];
    let groupId = data['ticket.assignee.group.id'];


    CLIENT.metadata().then(function(metadata){

      let groupIds = metadata.settings.group_ids.split(',') // Turns comma separated string into an array
      .map(function(id){ return parseInt(id); }) // Turns the array of strings into an array of integers
      
      if (!assigneeId && groupIds.includes(groupId)){
        CLIENT.set('ticket.assignee',{ userId: currentUser.id });
      }

    });

  });
  // Old
  // client.get(['ticket.assignee','currentUser']).then(function(e) {
  //   if (typeof e['ticket.assignee'].user === "undefined"  && (e['ticket.assignee'].group.id === 360001785154 || e['ticket.assignee'].group.id === 360002693173)){
  //
  //     client.set('ticket.assignee',{ userId: e.currentUser.id});
  //     return true;
  //   } else {
  //     return true;
  //   }
  // });
  // ========================================================


  // On Assignee Change
  // ========================================================
  CLIENT.on('ticket.assignee.user.id.changed',function(newAssigneeId){

    if (newAssigneeId){
      CLIENT.invoke('enableSave');
    } else {
      CLIENT.invoke('notify','<b>Agent Assignment Required</b><p></p><p>All tickets must have a user assigned<p>','error',4000);
      CLIENT.invoke('disableSave');
    }

  });
  // Old
  // client.on('ticket.assignee.user.id.changed', function(data){
  //   checkAssignee(client)
  // });
  // ========================================================


  // Check Assignee
  // ========================================================
  // Old
  // function checkAssignee(client) {
  //   client.get('ticket.assignee.user.id').then(
  //     function(data){
  //
  //       if (Number.isInteger(data['ticket.assignee.user.id'])){
  //         client.invoke('enableSave');
  //       }
  //     }, function(response) {
  //
  //     client.invoke('notify', '<b>Agent Assignment Required</b><p></p><p>All tickets must have a user assigned<p>', 'error', 4000)
	// 		client.invoke('disableSave')
  //
  //     }
  //   )
  // };
  // ========================================================
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-


});

$(function () {
  let client = ZAFClient.init();

  client.invoke('hide');
  // client.invoke('userFields:groups.hide');
  // client.invoke('userFields:signature.hide');

  client.get(['ticket.assignee','currentUser']).then(function(e) {
        if (typeof e['ticket.assignee'].user === "undefined"  && (e['ticket.assignee'].group.id === 360001785154 || e['ticket.assignee'].group.id === 360002693173)){

          client.set('ticket.assignee',{ userId: e.currentUser.id});
          return true;
        } else {
          return true;
        }
      });


  client.on('ticket.assignee.user.id.changed', function(data){
    checkAssignee(client)
  });

  function checkAssignee(client) {
    client.get('ticket.assignee.user.id').then(
      function(data){

        if (Number.isInteger(data['ticket.assignee.user.id'])){
          client.invoke('enableSave');
        }
      }, function(response) {

      client.invoke('notify', '<b>Agent Assignment Required</b><p></p><p>All tickets must have a user assigned<p>', 'error', 4000)
			client.invoke('disableSave')

      }
    )
  };


});

"use strict";

habitrpg.controller("HeaderCtrl", ['$scope', 'Groups', 'User', '$location', '$rootScope',
  function($scope, Groups, User, $location, $rootScope) {

    $scope.Math = window.Math;
    $scope.user = User.user;

    $scope.party = Groups.party(function(){
        var triggerResort = function() {
            $scope.partyMinusSelf = resortParty();
        };

        triggerResort();
        $scope.$watch('user.party.order', triggerResort);
        $scope.$watch('user.party.orderAscending', triggerResort);
    });

    $scope.inviteOrStartParty = function(group) {
      if (group.type === "party") {
        $rootScope.openModal('invite-friends', {
          controller:'InviteToGroupCtrl',
          resolve: {
            injectedGroup: function(){ return group; }
          }
        });
      } else {
        $location.path("/options/groups/party");
      }
    }

    function resortParty() {
      var result = _.sortBy(
        _.filter($scope.party.members, function(member){
          return member._id !== User.user._id;
        }),
        function (member) {
          switch(User.user.party.order)
          {
              case 'level':
                return member.stats.lvl;
                break;
              case 'random':
                return Math.random();
                break;
              case 'pets':
                return member.items.pets.length;
                break;
              case 'name':
                return member.profile.name;
                break;
              case 'backgrounds':
                return member.preferences.background;
                break;
              case 'habitrpg_date_joined':
                return member.auth.timestamps.created;
                break
              case 'habitrpg_last_logged_in':
                return member.auth.timestamps.loggedin;
                break
              default:
                // party date joined
                return true;
          }
        }
      )
      if (User.user.party.orderAscending == "descending") {
      	result = result.reverse()
      }

      return result;
    }
  }
]);

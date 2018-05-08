!function(){"use strict";angular.module("SOGo.ContactsUI",["ngCookies","ui.router","angularFileUpload","ck","SOGo.Common","SOGo.PreferencesUI","SOGo.MailerUI"]).config(e).run(a),e.$inject=["$stateProvider","$urlRouterProvider"];function e(e,a){e.state("app",{url:"/addressbooks",abstract:!0,views:{addressbooks:{templateUrl:"UIxContactFoldersView",controller:"AddressBooksController",controllerAs:"app"}},resolve:{stateAddressbooks:t}}).state("app.addressbook",{url:"/:addressbookId",views:{addressbook:{templateUrl:"addressbook",controller:"AddressBookController",controllerAs:"addressbook"}},resolve:{stateAddressbook:o}}).state("app.addressbook.new",{url:"/{contactType:(?:card|list)}/new",params:{refs:{array:!0}},views:{card:{templateUrl:"UIxContactEditorTemplate",controller:"CardController",controllerAs:"editor"}},resolve:{stateCard:r}}).state("app.addressbook.card",{url:"/:cardId",abstract:!0,views:{card:{template:"<ui-view/>"}},resolve:{stateCard:s},onEnter:d,onExit:n}).state("app.addressbook.card.view",{url:"/view",views:{"card@app.addressbook":{templateUrl:"UIxContactViewTemplate",controller:"CardController",controllerAs:"editor"}}}).state("app.addressbook.card.editor",{url:"/edit",views:{"card@app.addressbook":{templateUrl:"UIxContactEditorTemplate",controller:"CardController",controllerAs:"editor"}}}),a.otherwise("/addressbooks/personal")}t.$inject=["AddressBook"];function t(e){return e.$findAll(window.contactFolders)}o.$inject=["$q","$state","$stateParams","AddressBook"];function o(e,t,o,r){var s=_.find(r.$findAll(),function(e){return e.id==o.addressbookId});return s?(delete s.selectedCard,s.$reload(),s):e.reject("Addressbook "+o.addressbookId+" not found")}r.$inject=["$stateParams","stateAddressbook","Card"];function r(e,t,o){var r="v"+e.contactType,s=new o({pid:e.addressbookId,c_component:r,refs:e.refs});return t.selectedCard=!0,s}s.$inject=["$state","$stateParams","stateAddressbook"];function s(e,t,o){return o.$futureAddressBookData.then(function(){var r=_.find(o.$cards,function(e){return e.id==t.cardId});if(r)return r.$reload();e.go("app.addressbook")})}d.$inject=["$stateParams","stateAddressbook"];function d(e,t){t.selectedCard=e.cardId}n.$inject=["stateAddressbook"];function n(e){delete o.selectedCard}a.$inject=["$rootScope","$log","$state"];function a(e,t,o){e.$on("$stateChangeError",function(e,r,s,d,n,a){t.error(a),o.go("app.addressbook",{addressbookId:"personal"})}),e.$on("$routeChangeError",function(e,o,r,s){t.error(e,o,r,s)})}}(),function(){"use strict";e.$inject=["$scope","$q","$window","$state","$timeout","$mdDialog","$mdToast","Account","Card","AddressBook","sgFocus","Dialog","sgSettings","sgHotkeys","stateAddressbooks","stateAddressbook"];function e(e,t,o,r,s,d,n,a,c,i,u,f,h,p,m,g){var $,k=this,b=[];$={c_cn:"Name",c_sn:"Lastname",c_givenname:"Firstname",c_mail:"Email",c_screenname:"Screen Name",c_o:"Organization",c_telephonenumber:"Preferred Phone"},this.$onInit=function(){i.selectedFolder=g,this.service=i,this.selectedFolder=g,this.mode={search:!1,multiple:0},(t=b).push(p.createHotkey({key:l("hotkey_search"),description:l("Search"),callback:angular.bind(k,k.searchMode)})),t.push(p.createHotkey({key:l("key_create_card"),description:l("Create a new address book card"),callback:angular.bind(k,k.newComponent,"card")})),t.push(p.createHotkey({key:l("key_create_list"),description:l("Create a new list"),callback:angular.bind(k,k.newComponent,"list")})),t.push(p.createHotkey({key:"space",description:l("Toggle item"),callback:angular.bind(k,k.toggleCardSelection)})),t.push(p.createHotkey({key:"shift+space",description:l("Toggle range of items"),callback:angular.bind(k,k.toggleCardSelection)})),t.push(p.createHotkey({key:"up",description:l("View next item"),callback:C})),t.push(p.createHotkey({key:"down",description:l("View previous item"),callback:v})),t.push(p.createHotkey({key:"shift+up",description:l("Add next item to selection"),callback:w})),t.push(p.createHotkey({key:"shift+down",description:l("Add previous item to selection"),callback:y})),_.forEach(["backspace","delete"],function(e){t.push(p.createHotkey({key:e,description:l("Delete selected card or address book"),callback:angular.bind(k,k.confirmDeleteSelectedCards)}))}),_.forEach(t,function(e){p.registerHotkey(e)});var t;e.$on("$destroy",function(){_.forEach(b,function(e){p.deregisterHotkey(e)})})};this.centerIsClose=function(e){return this.selectedFolder.hasSelectedCard()&&!!e},this.selectCard=function(e){r.go("app.addressbook.card.view",{cardId:e.id})},this.toggleCardSelection=function(e,t){var o,r,s,d=this.selectedFolder;if(t||(t=d.$selectedCard()),t.selected=!t.selected,this.mode.multiple+=t.selected?1:-1,e.shiftKey&&d.$selectedCount()>1){for(r=(o=d.idsMap[t.id])-2;r>=0&&!d.$cards[r].selected;)r--;if(r<0)for(r=o+2;r<d.getLength()&&!d.$cards[r].selected;)r++;if(r>=0&&r<d.getLength())for(s=Math.min(o,r);s<=Math.max(o,r);s++)d.$cards[s].selected=!0}e.preventDefault(),e.stopPropagation()},this.newComponent=function(e){r.go("app.addressbook.new",{contactType:e})},this.unselectCards=function(){_.forEach(this.selectedFolder.$cards,function(e){e.selected=!1}),this.mode.multiple=0};function C(e){var t=k.selectedFolder.$selectedCardIndex();return angular.isDefined(t)?(t--,k.selectedFolder.$topIndex>0&&k.selectedFolder.$topIndex--):(t=k.selectedFolder.$cards.length()-1,k.selectedFolder.$topIndex=k.selectedFolder.getLength()),t>-1&&k.selectCard(k.selectedFolder.$cards[t]),e.preventDefault(),t}function v(e){var t=k.selectedFolder.$selectedCardIndex();return angular.isDefined(t)?(t++,k.selectedFolder.$topIndex<k.selectedFolder.$cards.length&&k.selectedFolder.$topIndex++):t=0,t<k.selectedFolder.$cards.length?k.selectCard(k.selectedFolder.$cards[t]):t=-1,e.preventDefault(),t}function w(e){var t;k.selectedFolder.hasSelectedCard()&&(t=C(e))>=0&&toggleCardSelection(e,k.selectedFolder.$cards[t])}function y(e){var t;k.selectedFolder.hasSelectedCard()&&(t=v(e))>=0&&toggleCardSelection(e,k.selectedFolder.$cards[t])}this.confirmDeleteSelectedCards=function(e){var t=this.selectedFolder.$selectedCards();_.size(t)>0&&f.confirm(l("Warning"),l("Are you sure you want to delete the selected contacts?"),{ok:l("Delete")}).then(function(){k.selectedFolder.$deleteCards(t).then(function(){k.mode.multiple=0,k.selectedFolder.selectedCard||r.go("app.addressbook")})}),e.preventDefault()};function F(e,t){var o,s,d,a,c,i,u;o=k.selectedFolder,c=!1,s=o.$selectedCards(),(d=_.filter(s,function(e){return e.$isCard()})).length!=s.length&&n.show(n.simple().content(l("Lists can't be moved or copied.")).position("top right").hideDelay(2e3)),d.length&&("copy"==e?(i=o.$copyCards(d,t),u=l("%{0} card(s) copied",d.length)):(i=o.$moveCards(d,t),u=l("%{0} card(s) moved",d.length),a=_.map(d,"id"),c=o.selectedCard&&a.indexOf(o.selectedCard)>=0),i.then(function(){c&&r.go("app.addressbook"),n.show(n.simple().content(u).position("top right").hideDelay(2e3))}))}this.copySelectedCards=function(e){F("copy",e)},this.moveSelectedCards=function(e){F("move",e)},this.selectAll=function(){_.forEach(this.selectedFolder.$cards,function(e){e.selected=!0}),this.mode.multiple=this.selectedFolder.$cards.length},this.sort=function(e){if(!e)return $[i.$query.sort];this.selectedFolder.$filter("",{sort:e})},this.sortedBy=function(e){return i.$query.sort==e},this.ascending=function(){return i.$query.asc},this.searchMode=function(){k.mode.search=!0,u("search")},this.cancelSearch=function(){this.mode.search=!1,this.selectedFolder.$filter("")},this.newMessage=function(e,t,o){a.$findAll().then(function(r){var s=_.find(r,function(e){if(0===e.id)return e});s.$getMailboxes().then(function(r){s.$newMessage().then(function(r){r.editable[o]=t,d.show({parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!1,escapeToClose:!1,templateUrl:"../Mail/UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor",locals:{stateAccount:s,stateMessage:r}})})})})},this.newMessageWithRecipient=function(e,t,o){var r=[o+" <"+t+">"];this.newMessage(e,r,"to"),e.stopPropagation(),e.preventDefault()},this.newMessageWithSelectedCards=function(e,o){var r=_.filter(this.selectedFolder.$cards,function(e){return e.selected}),s=[],d=[];_.forEach(r,function(e){e.$isList({expandable:!0})?angular.isDefined(e.refs)&&e.refs.length?_.forEach(e.refs,function(e){e.email.length&&d.push(e.$shortFormat())}):s.push(e.$reload().then(function(e){_.forEach(e.refs,function(e){e.email.length&&d.push(e.$shortFormat())})})):e.c_mail.length&&d.push(e.$shortFormat())}),t.all(s).then(function(){(d=_.uniq(d)).length&&k.newMessage(e,d,o)})},this.newListWithSelectedCards=function(){var e=_.filter(this.selectedFolder.$cards,function(e){return e.selected}),o=[],s=[];_.forEach(e,function(e){e.$isList({expandable:!0})?angular.isDefined(e.refs)&&e.refs.length?_.forEach(e.refs,function(e){e.email.length&&s.push(e)}):o.push(e.$reload().then(function(e){_.forEach(e.refs,function(e){e.email.length&&s.push(e)})})):e.$$email&&e.$$email.length&&s.push(e)}),t.all(o).then(function(){(s=_.uniqBy(_.map(s,function(e){return{reference:e.id||e.reference,email:e.$$email||e.email}}),"reference")).length&&r.go("app.addressbook.new",{contactType:"list",refs:s})})}}angular.module("SOGo.ContactsUI").controller("AddressBookController",e)}(),function(){"use strict";e.$inject=["$q","$state","$scope","$rootScope","$stateParams","$timeout","$window","$mdDialog","$mdToast","$mdMedia","$mdSidenav","FileUploader","sgConstant","sgHotkeys","sgFocus","Card","AddressBook","Dialog","sgSettings","User","stateAddressbooks"];function e(e,t,o,r,s,d,n,a,c,i,u,f,h,p,m,g,$,k,b,C,v){var w=this,y=[];w.activeUser=b.activeUser,w.service=$,w.select=function(e,o){t.params.addressbookId!=o.id&&w.editMode!=o.id&&(w.editMode=!1,$.$query.value="",i(h["gt-md"])||u("left").close(),t.go("app.addressbook",{addressbookId:o.id}))},w.newAddressbook=function(){k.prompt(l("New Addressbook..."),l("Name of the Address Book")).then(function(e){var t=new $({name:e,isEditable:!0,isRemote:!1,owner:UserLogin});$.$add(t)})},w.edit=function(e){e.isRemote||(w.editMode=e.id,w.originalAddressbook=e.$omit(),m("addressBookName_"+e.id))},w.revertEditing=function(e){e.name=w.originalAddressbook.name,w.editMode=!1},w.save=function(e){var t=e.name;t&&t.length>0&&(t!=w.originalAddressbook.name?e.$rename(t).then(function(e){w.editMode=!1},function(e,t){k.alert(l("Warning"),e)}):w.editMode=!1)},w.confirmDelete=A,w.importCards=function(e,t){a.show({parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,escapeToClose:!0,templateUrl:"UIxContactsImportDialog",controller:o,controllerAs:"$CardsImportDialogController",locals:{folder:t}}),o.$inject=["scope","$mdDialog","folder"];function o(e,t,o){this.uploader=new f({url:ApplicationBaseURL+[o.id,"import"].join("/"),autoUpload:!0,queueLimit:1,filters:[{name:r,fn:r}],onSuccessItem:function(e,o,r,s){var d;t.hide(),0===o.imported?d=l("No card was imported."):(d=l("A total of %{0} cards were imported in the addressbook.",o.imported),$.selectedFolder.$reload()),c.show(c.simple().content(d).position("top right").hideDelay(3e3))},onErrorItem:function(e,t,o,r){c.show({template:["<md-toast>",'  <div class="md-toast-content">','    <md-icon class="md-warn md-hue-1">error_outline</md-icon>',"    <span>"+l("An error occured while importing contacts.")+"</span>","  </div>","</md-toast>"].join(""),position:"top right",hideDelay:3e3})}}),this.close=function(){t.hide()};function r(e){var t=0===e.type.indexOf("text")||/\.(ldif|vcf|vcard)$/.test(e.name);return t||c.show({template:["<md-toast>",'  <div class="md-toast-content">','    <md-icon class="md-warn md-hue-1">error_outline</md-icon>',"    <span>"+l("Select a vCard or LDIF file.")+"</span>","  </div>","</md-toast>"].join(""),position:"top right",hideDelay:3e3}),t}}},w.showLinks=function(t){var o;o=t.urls?e.when():$.$reloadAll();o.then(function(){a.show({parent:angular.element(document.body),clickOutsideToClose:!0,escapeToClose:!0,templateUrl:t.id+"/links",controller:r,controllerAs:"links",locals:{addressbook:t}})}),r.$inject=["$mdDialog","addressbook"];function r(e,t){this.addressbook=t,this.close=function(){e.hide()}}},w.showProperties=function(e){a.show({templateUrl:e.id+"/properties",controller:t,controllerAs:"properties",clickOutsideToClose:!0,escapeToClose:!0,locals:{srcAddressBook:e}}).catch(function(){}),t.$inject=["$scope","$mdDialog","srcAddressBook"];function t(e,t,o){var r=this;r.addressbook=new $(o.$omit()),r.saveProperties=function(){r.addressbook.$save().then(function(){o.init(r.addressbook.$omit()),t.hide()})},r.close=function(){t.cancel()}}},w.share=function(e){e.$acl.$users().then(function(){a.show({templateUrl:e.id+"/UIxAclEditor",controller:"AclController",controllerAs:"acl",clickOutsideToClose:!0,escapeToClose:!0,locals:{usersWithACL:e.$acl.users,User:C,folder:e}})})},w.subscribeToFolder=function(e){console.debug("subscribeToFolder "+e.owner+e.name),$.$subscribe(e.owner,e.name).then(function(e){c.show(c.simple().content(l("Successfully subscribed to address book")).position("top right").hideDelay(3e3))})},w.isDroppableFolder=function(e,t){return t.id!=e.id&&(t.isOwned||t.acls.objectCreator)},w.dragSelectedCards=function(e,o,r){var s,d,n,a,i,u,f;s=o.id,i=!1,0===(d=e.$selectedCards()).length&&(d=[e.$selectedCard()]);(n=_.filter(d,function(e){return e.$isCard()})).length!=d.length&&c.show(c.simple().content(l("Lists can't be moved or copied.")).position("top right").hideDelay(2e3));n.length&&("copy"==r?(u=e.$copyCards(n,s),f=l("%{0} card(s) copied",n.length)):(u=e.$moveCards(n,s),f=l("%{0} card(s) moved",n.length),a=_.map(n,"id"),i=e.selectedCard&&a.indexOf(e.selectedCard)>=0),u.then(function(){i&&t.go("app.addressbook"),c.show(c.simple().content(f).position("top right").hideDelay(2e3))}))},F=y,_.forEach(["backspace","delete"],function(e){F.push(p.createHotkey({key:e,description:l("Delete selected card or address book"),callback:function(){$.selectedFolder&&!$.selectedFolder.hasSelectedCard()&&A()}}))}),_.forEach(F,function(e){p.registerHotkey(e)});var F;o.$on("$destroy",function(){_.forEach(y,function(e){p.deregisterHotkey(e)})});function A(){w.service.selectedFolder.isSubscription?w.service.selectedFolder.$delete().then(function(){w.service.selectedFolder=null,t.go("app.addressbook",{addressbookId:"personal"})},function(e,t){k.alert(l('An error occured while deleting the addressbook "%{0}".',w.service.selectedFolder.name),l(e.error))}):k.confirm(l("Warning"),l('Are you sure you want to delete the addressbook "%{0}"?',w.service.selectedFolder.name),{ok:l("Delete")}).then(function(){return w.service.selectedFolder.$delete()}).then(function(){return w.service.selectedFolder=null,t.go("app.addressbook",{addressbookId:"personal"}),!0}).catch(function(e){if(e){var t=e.data.message||e.statusText;k.alert(l('An error occured while deleting the addressbook "%{0}".',w.service.selectedFolder.name),t)}})}}angular.module("SOGo.ContactsUI").controller("AddressBooksController",e)}(),function(){"use strict";e.$inject=["$scope","$timeout","$window","$mdDialog","sgSettings","AddressBook","Card","Dialog","sgHotkeys","sgFocus","$state","$stateParams","stateCard"];function e(e,t,o,r,s,d,n,a,c,i,u,f,h){var p=this,m=[];p.card=h,p.currentFolder=d.selectedFolder,p.allEmailTypes=n.$EMAIL_TYPES,p.allTelTypes=n.$TEL_TYPES,p.allUrlTypes=n.$URL_TYPES,p.allAddressTypes=n.$ADDRESS_TYPES,p.categories={},p.userFilterResults=[],p.transformCategory=function(e){return angular.isString(e)?{value:e}:e},p.removeAttribute=function(e,t,o){p.card.$delete(t,o),e.$setDirty()},p.addOrg=function(){var e=p.card.$addOrg({value:""});i("org_"+e)},p.addBirthday=function(){p.card.birthday=new Date},p.addScreenName=function(){p.card.$addScreenName("")},p.addEmail=function(){var e=p.card.$addEmail("");i("email_"+e)},p.addPhone=function(){var e=p.card.$addPhone("");i("phone_"+e)},p.addUrl=function(){var e=p.card.$addUrl("","");i("url_"+e)},p.addAddress=function(){var e=p.card.$addAddress("","","","","","","","");i("address_"+e)},p.canAddCustomField=function(){return _.keys(h.customFields).length<4},p.addCustomField=function(){angular.isDefined(p.card.customFields)||(p.card.customFields={});var e=_.pullAll(["1","2","3","4"],_.keys(h.customFields));p.card.customFields[e[0]]=""},p.deleteCustomField=function(e){delete p.card.customFields[e]},p.userFilter=function(e,t){return e.length<s.minimumSearchLength()?[]:d.selectedFolder.$filter(e,{dry:!0,excludeLists:!0},t).then(function(e){return e})},p.save=function(e){e.$valid&&p.card.$save().then(function(e){var t=_.indexOf(_.map(d.selectedFolder.$cards,"id"),p.card.id);t<0?d.selectedFolder.$reload():d.selectedFolder.$cards[t]=angular.copy(p.card),u.go("app.addressbook.card.view",{cardId:p.card.id})})},p.close=$,p.reset=function(e){p.card.$reset(),e.$setPristine()},p.cancel=function(){p.card.$reset(),p.card.isNew?(p.card=null,delete d.selectedFolder.selectedCard,u.go("app.addressbook",{addressbookId:d.selectedFolder.id})):u.go("app.addressbook.card.view",{cardId:p.card.id})},p.confirmDelete=k,p.toggleRawSource=function(e){p.showRawSource||p.rawSource?p.showRawSource=!p.showRawSource:n.$$resource.post(p.currentFolder.id+"/"+p.card.id,"raw").then(function(e){p.rawSource=e,p.showRawSource=!0})},p.showRawSource=!1,g=m,_.forEach(["backspace","delete"],function(e){g.push(c.createHotkey({key:e,description:l("Delete"),callback:function(e){0===p.currentFolder.$selectedCount()&&k(),e.preventDefault()}}))}),_.forEach(g,function(e){c.registerHotkey(e)});var g;p.card.hasCertificate&&p.card.$certificate().then(function(e){p.certificate=e},function(){delete p.card.hasCertificate}),e.$on("$destroy",function(){_.forEach(m,function(e){c.deregisterHotkey(e)})});function $(){u.go("app.addressbook").then(function(){p.card=null,delete d.selectedFolder.selectedCard})}function k(){var e=h;a.confirm(l("Warning"),l("Are you sure you want to delete the card of %{0}?","<b>"+e.$fullname()+"</b>"),{ok:l("Delete")}).then(function(){d.selectedFolder.$deleteCards([e]).then(function(){$()},function(t,o){a.alert(l("Warning"),l('An error occured while deleting the card "%{0}".',e.$fullname()))})})}}angular.module("SOGo.ContactsUI").controller("CardController",e)}(),function(){"use strict";angular.module("SOGo.Common").directive("sgAddress",function(){return{restrict:"A",scope:{data:"=sgAddress"},controller:["$scope",function(e){e.addressLines=function(e){var t=[],o=[];return e.street&&t.push(e.street),e.street2&&t.push(e.street2),e.locality&&o.push(e.locality),e.region&&o.push(e.region),o.length>0&&t.push(o.join(", ")),e.country&&t.push(e.country),e.postalcode&&t.push(e.postalcode),t.join("<br>")}}],template:'<address ng-bind-html="addressLines(data)"></address>'}})}();
//# sourceMappingURL=Contacts.js.map
(function () {
    angular
        .module ("WebAppMakerApp")
        .controller ("ShareWebsiteController", shareWebsiteController)
        .controller ("WebsiteListController", websiteListController)
        .controller ("NewWebsiteController", newWebsiteController)
        .controller ("EditWebsiteController", editWebsiteController);

    function shareWebsiteController
        ($routeParams, WebsiteService, $location) {

        var vm = this;
        vm.username = $routeParams.username;
        vm.websiteId = $routeParams.websiteId;
        
        vm.shareWebsite = shareWebsite;
        vm.unshareWebsite = unshareWebsite;

        function init() {
            WebsiteService
                .findDevelopersSharingWebsite(vm.websiteId)
                .then(
                    function(response) {
                        vm.developers = response.data;
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function unshareWebsite(username) {
            WebsiteService
                .unshareWebsite(vm.websiteId, username)
                .then(
                    function(response) {
                        return WebsiteService
                            .findDevelopersSharingWebsite(vm.websiteId);
                    },
                    function(err) {
                        vm.error = err;
                    }
                )
                .then(
                    function(response) {
                        vm.developers = response.data;
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }

        function shareWebsite(developer) {
            WebsiteService
                .shareWebsite(vm.websiteId, developer.username)
                .then(
                    function(response) {
                        return WebsiteService
                            .findDevelopersSharingWebsite(vm.websiteId);
                    },
                    function(err) {
                        vm.error = err;
                    }
                )
                .then(
                    function(response) {
                        vm.developers = response.data;
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
    }

    function editWebsiteController
        ($routeParams, WebsiteService, $location) {

        var vm = this;
        vm.developerId = $routeParams.developerId;
        vm.websiteId = $routeParams.websiteId;
        vm.removeWebsite = removeWebsite;
        vm.updateWebsite = updateWebsite;

        function init () {
            WebsiteService
                .findWebsiteById($routeParams.websiteId)
                .then(
                    function(response) {
                        vm.website = response.data;
                    },
                    function(err) {
                        vm.error = err;
                    }
                )
        }
        init ();

        function removeWebsite(website) {
            WebsiteService
                .removeWebsite(website)
                .then(
                    function(response) {
                        $location.url ("/developer/"+website._developer+"/website");
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }

        function updateWebsite(website) {
            WebsiteService
                .updateWebsite(website)
                .then(
                    function(response) {
                        $location.url ("/developer/"+website._developer+"/website");
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
    }

    function websiteListController (
        $routeParams, WebsiteService) {

        var vm = this;
        vm.developerId = $routeParams.developerId;
        vm.viewType = 'list';
        vm.toggleView    = toggleView;
		
        function init () {
            WebsiteService
                .findWebsitesForDeveloperId ($routeParams.developerId)
                .then (
                    function (response) {
                        vm.websites = response.data;
                    },
                    function (err) {
                        vm.error = err;
                    }
                )
        }
        init ();

        function toggleView() {
            vm.viewType = vm.viewType === 'list' ? 'grid' : 'list';
        }
		
		vm.sortList = function(by, ordr){
			vm.websites = sortByOrder(vm.websites, ordr);
		}
		
		function sortByOrder(arr, ordr){
			return arr.sort(function (w1, w2){
				if(ordr == 'asc')
					return w1.name > w2.name;
				else return w1.name < w2.name;
			});
		}
		
    }

    function newWebsiteController (
        $routeParams, WebsiteService, $location) {

        var vm = this;
        vm.developerId = $routeParams.developerId;
        vm.createWebsite = createWebsite;

        function createWebsite (website) {
            if(!website)
                return;
            website._developer = vm.developerId;
            // website.developerUsername = vm.username;
            WebsiteService
                .createWebsite (website)
                .then (
                    function (response) {
                        $location.url ("/developer/"+vm.developerId+"/website");
                    },
                    function (err) {
                        vm.error = err;
                    }
                )
        }
    }
})();
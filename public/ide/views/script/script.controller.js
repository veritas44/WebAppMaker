(function(){
    angular
        .module("WebAppMakerApp")
        .controller("EditStatementController", EditStatementController)
        .controller("ChooseStatementController", ChooseStatementController)
        .controller("EditScriptController", EditScriptController)
        .controller("NewScriptController", NewScriptController)
        .controller("ScriptListController", ScriptListController);

    // controller for the statement editor
    function EditStatementController($routeParams, ScriptService, $location, $scope) {

        var vm = this;

        vm.statementId = $routeParams.statementId;

        vm.statementTypes = [
            {label: 'Numeric'},
            {label: 'String'},
            {label: 'Boolean'},
            {label: 'Conditional'},
            {label: 'Navigation'},
            {label: 'Date'},
            {label: 'Database'}
        ];
        vm.statementType = vm.statementTypes[6];

        vm.databaseOperations = [
            {label: 'Select'},
            {label: 'Insert'},
            {label: 'Update'},
            {label: 'Delete'}
        ];
        vm.databaseOperation = vm.databaseOperations[0];

        vm.collections = [
            {label: 'Collection 1'},
            {label: 'Collection 2'},
            {label: 'Collection 3'}
        ];

        vm.variables = [
            {label: 'Var 1'},
            {label: 'Var 2'},
            {label: 'Var 3'}
        ];

        vm.comparators = [
            {label: '='},
            {label: '>'},
            {label: '>='},
            {label: '<'},
            {label: '<='}
        ];

        // vm.statementType = vm.statementTypes[2];

        // route params
        vm.username    = $routeParams.username;
        vm.developerId = $routeParams.developerId;
        vm.websiteId   = $routeParams.websiteId;
        vm.pageId      = $routeParams.pageId;
        vm.widgetId    = $routeParams.widgetId;
        vm.statementId = $routeParams.statementId;

        // event handlers
        vm.updateStatement = updateStatement;
        vm.deleteStatement = deleteStatement;

        // retrieve statement on load
        function init() {
            ScriptService
                .findStatement(vm)
                .then(
                    function(response) {
                        vm.statement = response.data;
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function deleteStatement() {
            ScriptService
                .deleteStatement(vm)
                .then(
                    function() {
                        $location.url("/developer/"+vm.username+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widgetId+"/script/edit");
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }

        function updateStatement() {
            console.log(vm.statement);
            ScriptService
                .updateStatement(vm, vm.statement)
                .then(
                    function() {
                        $location.url("/developer/"+vm.username+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widgetId+"/script/edit");
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
    }

    function ChooseStatementController($routeParams, ScriptService, $location) {

        var vm = this;

        // route params
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        vm.selectStatement = selectStatement;

        // handle statement type selection
        function selectStatement(statementType) {
            // notify Web service of new statement
            ScriptService
                .addStatement(vm, statementType)
                .then(
                    function(response) {
                        var statements = response.data.button.script.statements;
                        var lastStatement = statements[statements.length - 1];
                        $location.url("/developer/"+vm.username+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/" + vm.widgetId + "/script/statement/" + lastStatement._id);
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }

    }

    function EditScriptController($routeParams, ScriptService, $location) {

        var vm = this;

        // route params
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        // event handlers
        vm.saveScript      = saveScript;

        function init() {
            ScriptService
                .findScript(vm)
                .then(
                    function(response) {
                        vm.script = response.data
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function saveScript(script) {
            ScriptService
                .saveScript(vm, script)
                .then(
                    function(){
                        var url  = "/developer/" + vm.username;
                            url += "/website/" + vm.websiteId;
                            url += "/page/" + vm.pageId;
                            url += "/widget/" + vm.widgetId;
                            url += "/edit";
                        $location.url(url);
                    },
                    function(err){
                        vm.error = err;
                    }
                );
        }
    }

    function NewScriptController($routeParams, ScriptService) {

        var vm = this;

        // route params
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        // event handlers
        vm.createScript  = createScript;

        function init() {

        }
        init();

        function createScript(script) {
            ScriptService
                .createScript(vm, script);
        }
    }

    function ScriptListController($routeParams) {

        var vm = this;

        // route params
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        function init() {

        }
        init();
    }
})();
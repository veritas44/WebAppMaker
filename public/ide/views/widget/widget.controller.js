(function () {
    angular
        .module ("WebAppMakerApp")
        .controller ("WidgetListController", widgetListController)
        .controller ("WidgetEditController", widgetEditController)
        .controller ("ChooseWidgetController", chooseWidgetController);

    function widgetEditController($routeParams, WidgetService, $location, PageService) {

        var vm = this;
        vm.username      = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId     = $routeParams.websiteId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        vm.updateWidget  = updateWidget;
        vm.removeWidget  = removeWidget;
        vm.changeWidget =changeWidget;
        function init() {
            PageService
                .findPagesForWebsite(vm.websiteId)
                .then(
                    function(response) {
                        vm.pages = response.data;
                        return WidgetService
                            .findWidgetById(vm.websiteId, vm.pageId, vm.widgetId);
                    },
                    function(err) {
                        vm.error = err;
                    }
                )
                .then(
                    function(response){
                        vm.widget = response.data;
                    },
                    function(error){
                        vm.error = err;
                    }
                );
        }
        init();

        function removeWidget(widget) {
            WidgetService
                .removeWidget(vm.websiteId, vm.pageId, vm.widgetId)
                .then(
                    function(response) {
                        $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page/"+vm.widget._page+"/widget");
                    },
                    function(error) {
                        vm.error = error;
                    }
                );
        }

        function updateWidget(widget) {
            WidgetService
                .updateWidget(vm.websiteId, vm.pageId, vm.widgetId, widget)
                .then(
                    function(response) {
                        $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page/"+widget._page+"/widget");
                    },
                    function(error) {
                        vm.error = error;
                    }
                );
        }
        function changeWidget(widget)
        {
            $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/" + vm.widgetId+"/image");
        }
    }

    function widgetListController ($routeParams, PageService, WidgetService, ScriptService, StatementService, $sce) {

        var vm = this;
        vm.username       = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId      = $routeParams.websiteId;
        vm.pageId         = $routeParams.pageId;
        vm.viewType = 'list';

        vm.safeYouTubeUrl = safeYouTubeUrl;
        vm.getButtonClass = getButtonClass;
        vm.sortWidget     = sortWidget;
        vm.trustAsHtml    = trustAsHtml;
        vm.toggleView    = toggleView;
        vm.runScript     = runScript;

        function init() {
            PageService
                .findPageById(vm.pageId)
                .then(
                    function(response) {
                        vm.page = response.data;
                        return WidgetService.getWidgets(vm.websiteId, vm.pageId);
                    },
                    function(error) {
                        vm.error = error;
                    }
                )
                .then(
                    function(response) {
                        vm.widgets = response.data;
                        //console.log(vm.widgets);
                        //runScript(vm.widgets[0]._id);
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
        init();

        function trustAsHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getButtonClass(style) {
            if(!style) {
                style = "default";
            }
            return "btn-"+style.toLowerCase();
        }

        function safeYouTubeUrl(widget) {
            if(widget && widget.youTube) {
                var urlParts = widget.youTube.url.split("/");
                var youTubeId = urlParts[urlParts.length-1];
                return $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+youTubeId);
            }
            return "";
        }

        function sortWidget(start, end) {
            WidgetService
                .sortWidget(vm.websiteId, vm.pageId, start, end)
                .then(
                    function (response) {
                    },
                    function (err) {
                        vm.error = err;
                    }
                );
        }
        
        function toggleView() {
            vm.viewType = vm.viewType === 'list' ? 'grid' : 'list';
        }

        function runScript(widgetId){
            var model = Object.create(vm);
            model.widgetId = widgetId;
            ScriptService
                .findScript(model)
                .then(
                    function(response) {
                        model.script = response.data;
                        console.log(model.script);
                        if(!model.script || model.script == 'null') {
                            model.script = {};
                        }
                        //AW: If script is present below action is executed
                        else {
                            model.scriptId = model.script._id;
                            StatementService
                                .findAllStatements(model)
                                .then(
                                    function (response) {
                                        model.statements = response.data;
                                        console.log(model.statements);

                                        for(var i = 0 ; i < model.statements.length; ++i){
                                            var statement = model.statements[i];
                                            if("STRING" === statement.statementType){
                                                var srtingStatement = statement.stringStatement;
                                                if("SUBSTRING" === statement.stringStatement.operationType){
                                                    var inputWidget;
                                                    var lengthWidget;
                                                    var outputWidget;
                                                    var startWidget;

                                                    for(var j =0; j < vm.widgets.length; ++j){
                                                        var widget = vm.widgets[j];
                                                        if(widget.name === srtingStatement.input1){
                                                            inputWidget = widget;
                                                        }

                                                        if(widget.name === srtingStatement.length){
                                                            lengthWidget = widget;
                                                        }

                                                        if(widget.name === srtingStatement.output){
                                                            outputWidget = widget;
                                                        }

                                                        if(widget.name === srtingStatement.start){
                                                            startWidget = widget;
                                                        }
                                                    }

                                                    var inputString;
                                                    if(inputWidget)
                                                        inputString = inputWidget.text;
                                                    else
                                                        inputString = statement.input1;

                                                    var length;
                                                    if(lengthWidget)
                                                        length = lengthWidget.text;
                                                    else
                                                        length = statement.length;

                                                    var startIndex;
                                                    if(startWidget)
                                                        startIndex = startWidget.text;
                                                    else
                                                        startIndex = statement.start;

                                                    var outputString = inputString.substring(startIndex, length);

                                                    if(outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);

                                                    //alert(outputString);
                                                }
                                                else if("LENGTH" === statement.stringStatement.operationType){
                                                    var inputWidget;
                                                    var outputWidget;

                                                    for(var j =0; j < vm.widgets.length; ++j){
                                                        var widget = vm.widgets[j];
                                                        if(widget.name === srtingStatement.input1){
                                                            inputWidget = widget;
                                                        }

                                                        if(widget.name === srtingStatement.output){
                                                            outputWidget = widget;
                                                        }
                                                    }

                                                    var inputString;
                                                    if(inputWidget)
                                                        inputString = inputWidget.text;
                                                    else
                                                        inputString = statement.input1;

                                                    var outputString = inputString.length;

                                                    if(outputWidget)
                                                        outputWidget.text = outputString;
                                                    else
                                                        alert(outputString);
                                                }
                                            }
                                        }
                                    },
                                    function (err) {
                                        vm.error = err;
                                    }
                                );
                        }
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }

    }

    function chooseWidgetController ($routeParams, WidgetService, PageService, $location) {

        var vm = this;

        vm.username  = $routeParams.username;
        vm.developerId   = $routeParams.developerId;
        vm.websiteId = $routeParams.websiteId;
        vm.pageId    = $routeParams.pageId;

        vm.selectWidget = selectWidget;

        function selectWidget(widgetType) {
            PageService
                .findPageById(vm.pageId)
                .then(
                    function(response) {
                        vm.page = response.data;
                        //console.log("PAge");
                        //console.log(vm.page);
                        return WidgetService
                            .addWidget(vm.developerId,vm.page._website, vm.page._id, widgetType)
                    },
                    function(error) {
                        vm.error = error;
                    }
                )
                .then(
                    function(response) {
                        var newWidget = response.data;
                        console.log("imageWidget");
                        console.log(newWidget);
                       if(newWidget.widgetType==="IMAGE")
                        {
                            console.log("New Image");
                            console.log(vm.developerId);
                            $location.url("/developer/"+vm.developerId+"/website/"+vm.websiteId+"/page/"+vm.page._id+"/widget/" + newWidget._id+"/image");
                        }
                        else {
                           $location.url("/developer/" + vm.developerId + "/website/" + vm.websiteId + "/page/" + vm.page._id + "/widget/" + newWidget._id);
                       }
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
    }

})();
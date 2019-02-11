import {
    uiModules
} from 'ui/modules';

const module = uiModules.get('kibana/transform_vis', ['kibana']);

module.controller('TrafficLightVisController', function ($scope, Private,config) {
    $scope.lines = [];
    $scope.records = [];
    $scope.percentperlight = 100;

    $scope.computeStyle = function (metric) {
        var res = {}

        if ($scope.vis.params.fixedSize) {
            res = {
                'width': $scope.vis.params.fixedw + 'px'
                , 'float': 'left'
                , 'height': $scope.vis.params.fixedh + 'px', 'border': 'solid white ' + $scope.vis.params.fixedb + 'px'
            };
        }
        else {
            //res = { 'width': $scope.vis.params.width + 'px', 'height': (2.68 * $scope.vis.params.width) + 'px' }
            res = { 'width': $scope.percentperlight + '%' };
            if ($scope.vis.params.displayMode == 'Plain')
            {
                res["height"]=$scope.vis.params.fixedh + 'px';
                res["border"]='solid white ' + $scope.vis.params.fixedb + 'px';
            }    
        }
        if ($scope.vis.params.displayMode == 'Plain') {
            if((!$scope.vis.params.invertScale && ((metric.value <= $scope.vis.params.redThreshold) || (metric.value > $scope.vis.params.max)))
                        || ($scope.vis.params.invertScale && metric.value >= $scope.vis.params.redThreshold))
            {
                res["background-color"] = "red";                
            }
            if((!$scope.vis.params.invertScale && metric.value > $scope.vis.params.redThreshold && metric.value < $scope.vis.params.greenThreshold) 
                        || ($scope.vis.params.invertScale && metric.value < $scope.vis.params.redThreshold && metric.value > $scope.vis.params.greenThreshold) )
            {
                res["background-color"] = "orange";                
            }
            if(
                (!$scope.vis.params.invertScale && metric.value >= $scope.vis.params.greenThreshold && metric.value <= $scope.vis.params.max)
                || ($scope.vis.params.invertScale && metric.value <= $scope.vis.params.greenThreshold) )
            {
                res["background-color"] = "green";       
            }
            res["border-radius"] = $scope.vis.params.fixedr + 'px';
        }


        return res;
    }
    $scope.computeStyleLegend = function (record) {
        var res = {}
        if ($scope.vis.params.displayMode == 'Plain')
            res =
                {

                    "position": "relative",
                    "top": "50%",
                    "-webkit-transform": "translateY(-50%)",
                    "-ms-transform": "translateY(-50%)",
                    "transform": "translateY(-50%)"
        }
        return res;
    }

    $scope.$watch('esResponse', function (resp) {
        if (resp) {
            var columns = resp.columns;
            var rows = resp.rows;

            var metrics = [];
            var lines = [];
            $scope.records = [];
            $scope.unit = '';
            if ($scope.vis.params.unit != '') {
                $scope.unit = ' ' + $scope.vis.params.unit
            }

            var i = 0;
            var lightsperline = $scope.vis.params.numberOfLights;

            if ($scope.vis.params.numberOfLights > 0) {
                $scope.percentperlight = 100 / $scope.vis.params.numberOfLights;
            }

            for (var r in rows) {
                var row = rows[r];

                if (i % lightsperline == 0) {
                    metrics = [];
                    lines.push(metrics);
                }

                // Visualizations without series return col-0-1 with no label.
                if (rows.length == 1 && "col-0-1" in row) {
                    var rec = {
                        "label": columns[0].name,
                        "value": row["col-0-1"]
                    };
                    $scope.records.push(rec);
                    metrics.push(rec);
                } else {

                    var rec = {
                        "label": row["col-0-2"],
                        "value": row["col-1-1"]
                    };
                    $scope.records.push(rec);
                    metrics.push(rec);
                }
                i++;
            }

            $scope.lines = lines;
        }
    });
});

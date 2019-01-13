import {
    uiModules
} from 'ui/modules';

const module = uiModules.get('kibana/transform_vis', ['kibana']);

module.controller('TrafficLightVisController', function ($scope, Private) {
    $scope.lines = [];
    $scope.percentperlight = 100;

    $scope.$watch('esResponse', function (resp) {
        if (resp) {
            var columns = resp.columns;
            var rows = resp.rows;

            var metrics = [];
            var lines = [];
            $scope.unit='';
            if ($scope.vis.params.unit!='')
            {
                $scope.unit=' '+$scope.vis.params.unit
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
                    metrics.push({
                        "label": "All",
                        "value": row["col-0-1"]
                    })
                } else {
                    metrics.push({
                        "label": row["col-0-2"],
                        "value": row["col-1-1"]
                    })
                }
                i++;
            }
            
            $scope.lines = lines;
        }
    });
});

import {
    uiModules
} from 'ui/modules';
const module = uiModules.get('kibana/transform_vis', ['kibana']);

module.controller('TrafficLightVisController', function ($scope, Private) {
    $scope.lines = [];

    $scope.percentperlight = 100;

//    console.log("PercentPerLight=" + $scope.percentperlight);

    $scope.$watch('esResponse', function (resp) {
        if (resp) {
//            console.log(resp);
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
//                console.log("Setting width traffic light width to:" + $scope.percentperlight);
            }

            for (var r in rows) {
                var row = rows[r];
//                console.log(r);
//                console.log(row);

                if (i % lightsperline == 0) {
                    metrics = [];
                    lines.push(metrics);
                }

                if (rows.length == 1) {
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
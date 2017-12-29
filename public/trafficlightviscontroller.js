import {
    uiModules
} from 'ui/modules';
const module = uiModules.get('kibana/transform_vis', ['kibana']);

module.controller('TrafficLightVisController', function ($scope, Private) {
    $scope.lines = [];

    $scope.percentperlight = 100;

    console.log("PercentPerLight=" + $scope.percentperlight);

    $scope.$watch('esResponse', function (resp) {
        if (resp) {
            var columns = resp.tables[0].columns;
            var rows = resp.tables[0].rows;

            var metrics = [];
            var lines = [];

            var i = 0;
            var lightsperline = $scope.vis.params.numberOfLights;

            if ($scope.vis.params.numberOfLights > 0) {
                $scope.percentperlight = 100 / $scope.vis.params.numberOfLights;
                console.log("Setting width traffic light width to:" + $scope.percentperlight);
            }

            for (var r in rows) {
                var row = rows[r];

                if (i % lightsperline == 0) {
                    metrics = [];
                    lines.push(metrics);
                }

                if (row.length == 1) {
                    metrics.push({
                        "label": columns[0].title,
                        "value": row[0]
                    })
                } else {
                    metrics.push({
                        "label": row[0],
                        "value": row[1]
                    })
                }
                i++;
            }

            console.log(JSON.stringify(lines));
            $scope.lines = lines;
        }
    });
});
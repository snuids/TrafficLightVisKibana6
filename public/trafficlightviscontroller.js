import {
    uiModules
} from 'ui/modules';
import { Scope } from 'babel-traverse';

const module = uiModules.get('kibana/transform_vis', ['kibana']);

module.controller('TrafficLightVisController', function ($scope, Private, config) {

    $scope.lines = [];
    $scope.records = [];
    $scope.percentperlight = 100;

    $scope.svgIcon = $scope.vis.params.svgPhone;

    $scope.vis.refreshComponent=function()
    {
        alert('toto 2');
        $scope.vis.forceReload();
    }

    $scope.computeStyle = function (metric) {
        var res = {}

        if ($scope.vis.params.displayMode == 'Icon') {
            //console.log($scope.vis.params.iconMode);
            switch ($scope.vis.params.iconMode) {
                case "Bag":
                    $scope.svgIcon = $scope.vis.params.svgBag;
                    break;
                default:
                    $scope.svgIcon = $scope.vis.params.svgPhone;
                    break;
            }
        }

        if ($scope.vis.params.fixedSize) {
            res = {
                'width': $scope.vis.params.fixedw + 'px'
                , 'float': 'left'
                , 'height': $scope.vis.params.fixedh + 'px'
                , 'border': 'solid white ' + $scope.vis.params.fixedb + 'px'
            };
        }
        else {
            //res = { 'width': $scope.vis.params.width + 'px', 'height': (2.68 * $scope.vis.params.width) + 'px' }
            res = { 'width': $scope.percentperlight + '%' };
            if ($scope.vis.params.displayMode == 'Plain') {
                res["height"] = $scope.vis.params.fixedh + 'px';
                res["border"] = 'solid white ' + $scope.vis.params.fixedb + 'px';
            }
        }
        if ($scope.vis.params.displayMode == 'Plain' || $scope.vis.params.displayMode == 'Frame') {
            if ((!$scope.vis.params.invertScale && ((metric.value <= $scope.vis.params.redThreshold) || (metric.value > $scope.vis.params.max)))
                || ($scope.vis.params.invertScale && metric.value >= $scope.vis.params.redThreshold)) {
                if ($scope.vis.params.displayMode == 'Plain')
                    res["background-color"] = $scope.vis.params.redColor;
                else {
                    res["border-color"] = $scope.vis.params.redColor;
                    res["color"] = $scope.vis.params.redColor;
                    $scope.overrideValueColor = $scope.vis.params.redColor;
                }
            }
            if ((!$scope.vis.params.invertScale && metric.value > $scope.vis.params.redThreshold && metric.value < $scope.vis.params.greenThreshold)
                || ($scope.vis.params.invertScale && metric.value < $scope.vis.params.redThreshold && metric.value > $scope.vis.params.greenThreshold)) {
                if ($scope.vis.params.displayMode == 'Plain')
                    res["background-color"] = $scope.vis.params.orangeColor;
                else {
                    res["border-color"] = $scope.vis.params.orangeColor;
                    res["color"] = $scope.vis.params.orangeColor;
                    $scope.overrideValueColor = $scope.vis.params.orangeColor;
                }
            }
            if (
                (!$scope.vis.params.invertScale && metric.value >= $scope.vis.params.greenThreshold && metric.value <= $scope.vis.params.max)
                || ($scope.vis.params.invertScale && metric.value <= $scope.vis.params.greenThreshold)) {
                if ($scope.vis.params.displayMode == 'Plain')
                    res["background-color"] = $scope.vis.params.greenColor;
                else {
                    res["border-color"] = $scope.vis.params.greenColor;
                    res["color"] = $scope.vis.params.greenColor;
                    $scope.overrideValueColor = $scope.vis.params.greenColor;
                }

            }
            res["border-radius"] = $scope.vis.params.fixedr + 'px';
        }

        res["margin"] = $scope.vis.params.margin + 'px';;
        return res;
    }
    $scope.computeStyleLegend = function (record) {
        var res = {}
        if ($scope.vis.params.displayMode == 'Plain' || $scope.vis.params.displayMode == 'Frame')
            res =
                {
                    "position": "relative",
                    "top": "50%",
                    "-webkit-transform": "translateY(-50%)",
                    "-ms-transform": "translateY(-50%)",
                    "transform": "translateY(-50%)"
                }
        if ($scope.vis.params.displayMode != 'Frame')
            res.color = $scope.vis.params.labelColor;
        return res;
    }
    $scope.getValueColor = function () {
        if ($scope.vis.params.displayMode == 'Frame')
            return $scope.overrideValueColor = "";
        else
            return $scope.vis.params.valueColor;
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
                $scope.percentperlight = 100 / Math.min($scope.vis.params.numberOfLights, rows.length);
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

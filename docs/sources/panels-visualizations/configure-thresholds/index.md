---
aliases:
  - ../panels/
  - ../panels/configure-thresholds/
  - ../panels/specify-thresholds/about-thresholds/
  - ../panels/specify-thresholds/add-a-threshold/
  - ../panels/specify-thresholds/add-threshold-to-graph/
  - ../panels/specify-thresholds/delete-a-threshold/
  - ../panels/thresholds/
description: This section includes information about using thresholds in your visualizations.
labels:
  products:
    - cloud
    - enterprise
    - oss
menuTitle: Configure thresholds
title: Configure thresholds
weight: 100
refs:
  state-timeline-visualization:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/state-timeline/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/state-timeline/
  geomap-visualization:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/geomap/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/geomap/
  gauge-visualization:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/gauge/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/gauge/
  time-series-visualization:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/time-series/#from-thresholds
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/time-series/#from-thresholds
  stat-visualization:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/stat/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/stat/
  table-visualization:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/table/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/table/
  visualization-panels:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/
---

# Configure thresholds

This section includes information about using thresholds in your visualizations. You'll learn about thresholds, their defaults, how to add or delete a threshold, and adding a threshold to a legacy panel.

## About thresholds

A threshold is a value that you specify for a metric that is visually reflected in a dashboard when the threshold value is met or exceeded.

Thresholds provide one method for you to conditionally style and color your visualizations based on query results. You can apply thresholds to most, but not all, visualizations. For more information about visualizations, refer to [Visualization panels](ref:visualization-panels).

You can use thresholds to:

- Color grid lines or grid areas in the [Time-series visualization](ref:time-series-visualization)
- Color lines in the [Time-series visualization](ref:time-series-visualization)
- Color the background or value text in the [Stat visualization](ref:stat-visualization)
- Color the gauge and threshold markers in the [Gauge visualization](ref:gauge-visualization)
- Color markers in the [Geomap visualization](ref:geomap-visualization)
- Color cell text or background in the [Table visualization](ref:table-visualization)
- Define regions and region colors in the [State timeline visualization](ref:state-timeline-visualization)

There are two types of thresholds:

- **Absolute** thresholds are defined by a number. For example, 80 on a scale of 1 to 150.
- **Percentage** thresholds are defined relative to minimum or maximum. For example, 80 percent.

{{< docs/play title="Threshold example" url="https://play.grafana.org/d/000000167/" >}}

### Default thresholds

On visualizations that support it, Grafana sets default threshold values of:

- 80 = red
- Base = green
- Mode = Absolute

The **Base** value represents minus infinity. It is generally the “good” color.

## Add or delete a threshold

You can add as many thresholds to a panel as you want. Grafana automatically sorts thresholds values from highest to lowest.

Delete a threshold when it is no longer needed. When you delete a threshold, the system removes the threshold from all visualizations that include the threshold.

1. To add a threshold:

   a. Edit the panel to which you want to add a threshold.

   b. In the options side pane, locate the **Thresholds** section and click **+ Add threshold**.

   c. Select a threshold color, number, and mode.
   Threshold mode applies to all thresholds on this panel.

   d. For a time-series panel, select a **Show thresholds** option.

1. To delete a threshold, navigate to the panel that contains the threshold and click the trash icon next to the threshold you want to remove.

## Add a threshold to a legacy graph panel

In the Graph panel visualization, thresholds enable you to add lines or sections to a graph to make it easier to recognize when the graph crosses a threshold.

1. Navigate to the graph panel to which you want to add a threshold.
1. On the **Panel** tab, click **Thresholds**.
1. Click **Add threshold**.
1. Complete the following fields:
   - **T1 -** Both values are required to display a threshold.
     - **lt** or **gt** - Select **lt** for less than or **gt** for greater than to indicate what the threshold applies to.
     - **Value -** Enter a threshold value. Grafana draws a threshold line along the Y-axis at that value.
   - **Color -** Choose a condition that corresponds to a color, or define your own color.
     - **custom -** You define the fill color and line color.
     - **critical -** Fill and line color are red.
     - **warning -** Fill and line color are yellow.
     - **ok -** Fill and line color are green.
   - **Fill -** Toggle the display of the threshold fill.
   - **Line -** Toggle the display of the threshold line.
   - **Y-Axis -** Choose to display the y-axis on either the **left** or **right** of the panel.
1. Click **Save** to save the changes in the dashboard.


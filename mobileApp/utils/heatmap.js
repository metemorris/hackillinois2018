export const generateHeatMap = (heatmap, setState) => {
    setTimeout(() => {
            heatmap.measure((ox, oy, width, height) => {
                const radius = Math.round(width * 0.05);
                const processedPoints = HeatmapUtils.processPoints(this.props.firstPoint,
                    this.props.secondPoint,
                    this.props.thirdPoint,
                    this.props.points,
                    width, height, radius);
                setState({ processedPoints, radius });
            });
        }
    );
}

export const heatmapInputGenerator = (points, radius, max) => {
    return `
    var heatmapInstance = h337.create({
      container: document.querySelector('.heatmap'),
      radius: ${radius}
    });
    heatmapInstance.setData({
      max: ${max},
      data: ${JSON.stringify(points)}
    });
  `;
}
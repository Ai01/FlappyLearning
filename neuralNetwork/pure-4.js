// n次训练
const X_MAX = 400;
const Y_MAX = 400;
const SVGNS = 'http://www.w3.org/2000/svg';

const rand = (high, low) => Math.random() * (high - low) + low;

// 对点分组
const team = point => point.x > point.y ? 1 : -1;

// 权重
const randomWeights = () => {
    return {
        x: rand(-1, 1),
        y: rand(-1, 1),
    }
}

// 猜测分组
const guess = (weights, points) => {
    const sum = points.x * weights.x + points.y * weights.y;
    const team = sum >= 0 ? 1 : -1
    return team;
};

// 训练函数
const train = (weights, point, rightTeam) => {
    const guessResult = guess(weights, point);
    const error = rightTeam - guessResult;

    return {
        x: weights.x + (point.x * error),
        y: weights.y + (point.y * error)
    }
}

// 生成点
const generatePoints = (amount  = 200) => {
    // 依据权重对点分组，权重随机
    return R.range(0, amount).map(_ => {
        const x = rand(0, X_MAX);
        const y = rand(0, Y_MAX);
        return {x, y}
    });
}

// 获取训练后的weight
const getWeightsAfterTrain = () => {
    const randomPoints = generatePoints(200000);

    let weight = randomWeights();
    randomPoints.forEach(point => {
        weight = train(weight, point, team(point));
    });

    return weight;
}

// 将点的数组添加到svg中
const addCircleToSvg = (points) => {
    const svgContainer = document.getElementById('svgContainer');
    const eleFragment = document.createDocumentFragment();

    const weight = getWeightsAfterTrain();

    points.forEach(i => {
        const { x, y, color } = i || {};
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 2);
        circle.setAttribute('fill', guess(weight, {x,y}) === -1 ? 'blue' : 'red');
        eleFragment.appendChild(circle);
    });

    svgContainer.appendChild(eleFragment);
}

// 将线添加到svg中
const addLineToSvg = () => {
    const svgContainer = document.getElementById('svgContainer');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 0);
    line.setAttribute('x2', X_MAX);
    line.setAttribute('y1', 0);
    line.setAttribute('y2', Y_MAX);
    line.setAttribute('stroke', "purple");
    svgContainer.appendChild(line);

    const xLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xLine.setAttribute('x1', 0);
    xLine.setAttribute('x2', X_MAX);
    xLine.setAttribute('y1', 5);
    xLine.setAttribute('y2', 5);
    xLine.setAttribute('stroke', "red");
    svgContainer.appendChild(xLine);

    const XArrow = document.createElementNS(SVGNS, 'path');
    XArrow.setAttribute('d', `M ${X_MAX-10} 0 L ${X_MAX} 5 L ${X_MAX-10} 10 z`);
    XArrow.setAttribute('style', 'fill:red;stroke-width:0.801524;stroke-miterlimit:4;stroke-dasharray:none');
    svgContainer.appendChild(XArrow);


    const yLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yLine.setAttribute('x1', 5);
    yLine.setAttribute('x2', 5);
    yLine.setAttribute('y1', 0);
    yLine.setAttribute('y2', Y_MAX);
    yLine.setAttribute('stroke', "blue");
    svgContainer.appendChild(yLine);

    const YArrow = document.createElementNS(SVGNS, 'path');
    YArrow.setAttribute('d', `M 0 ${Y_MAX-10} L 10 ${Y_MAX-10} L 5 ${Y_MAX} z`);
    YArrow.setAttribute('style', 'fill:blue;stroke-width:0.801524;stroke-miterlimit:4;stroke-dasharray:none');
    svgContainer.appendChild(YArrow);
}

const randomPoints = generatePoints(200);

// 人为逻辑
addCircleToSvg(randomPoints);
addLineToSvg();
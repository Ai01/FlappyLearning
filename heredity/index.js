// 文档：https://rattle-club-ee4.notion.site/FlappyBird-7834479478bc44769779933682b844d2
// 遗传算法实现

let X1 = [1, 2, 3, 4, 5, 6, 7];
let X2 = [1, 2, 3, 4, 5, 6, 7];

// 个体编码：将10进制的数字转为2进制
// num 是要转换为2进制的数字，len是二进制的长度，不足要补。当前情况默认为3
// 返回是string类型
function getNumToBinary(num, len = 3) {
    if (typeof num === 'number') {
        let res = parseInt(num).toString(2);

        const lenForRes = res.length;

        // 假设最多4位
        if (len < lenForRes) {
            res = res.substr(1);
        }

        // 长度不足补齐0
        if (len > lenForRes) {
            for (let i = 0; i < len - lenForRes; i++) {
                res = '0' + res;
            }
        }

        return res;
    }
    return null;
}

// 测试： 二进制转10进制
// console.log(getNumToBinary(6));


// 获取初始种群
// 从x1, x2中随机取一个数字，组合为个体编码。重复四次
function getOriginalGeneration(x1, x2) {
    function getRandomNumInArray(arr) {
        if (!Array.isArray(arr)) return null;
        const index = Math.round(Math.random() * (arr.length - 1));
        return arr[index];
    }

    let originalPopulation = [];
    for (let i = 0; i < 4; i++) {
        let unitPart1 = getNumToBinary(getRandomNumInArray(x1));
        let unitPart2 = getNumToBinary(getRandomNumInArray(x2));
        if (unitPart1 && unitPart2) {
            const unit = unitPart1 + unitPart2;
            originalPopulation.push(unit);
        }
    }

    return originalPopulation;
}

// 测试：获取初始种群
// console.log(getOriginalGeneration(X1, X2));


// 如何计算适应度
// 计算0，1表示的个体在x1*x1 + x2*x2的情况下的大小
function getScoreForUnit(unit) {
    // 分割二进制字符串
    const unitPart1 = unit.slice(0, 3);
    const unitPart2 = unit.slice(3, 6);

    // 二进制转10进制
    const originUnitPart1 = parseInt(unitPart1, 2);
    const originUnitPart2 = parseInt(unitPart2, 2);

    // 计算
    if (typeof originUnitPart2 === 'number' && typeof originUnitPart1 === 'number') {
        return originUnitPart1 * originUnitPart1 + originUnitPart2 * originUnitPart2;
    }
    return null;
}

// 测试: 7*7 + 7*7
// console.log(getScoreForUnit('111111'));

// 选择计算
// 先计算出群体里面所有个体的适应度的总和 unitSum
// 计算个体的相对适应度：scoreForUnit / unitSum。会得到个体被留下的概率，依据概率进行选择，概率越大，被留下的可能应该越高
function naturalSelectCal(generation) {
    if (!Array.isArray(generation)) return null;
    const scoreForGenerations = generation.map(i => {
        return getScoreForUnit(i);
    });
    const sumScoreForGeneration = scoreForGenerations.reduce((a, b) => a + b, 0);
    const probabilityForGenerations = scoreForGenerations.map(i => Number((i / sumScoreForGeneration).toFixed(2)));

    // 如何根据概率，选择是否存在
    // 执行generation.length次循环，每次循环中执行math.random，根据math.random的大小来看落到了那一个区间。
    let countForReplicate = new Array(generation.length).fill(0);
    let compareSection = [];
    for (let i = 1; i < generation.length + 1; i++) {
        let sum = probabilityForGenerations.slice(0, i).reduce((a, b) => a + b, 0);
        compareSection.push(sum);
    }

    while (countForReplicate.reduce((a, b) => a + b, 0) < 4) {
        let tmpVal = Math.random();
        for (let i = 0; i < compareSection.length; i++) {
            if (i !== 0 && tmpVal <= compareSection[i] && tmpVal > compareSection[i-1]) {
                countForReplicate[i] += 1;
                break;
            }
            if(i === 0 && tmpVal <= compareSection[i]) {
                countForReplicate[i] += 1;
                break;
            }
        }
    }

    console.log('自然选择内部机制：', probabilityForGenerations, countForReplicate);
    let res = [];
    countForReplicate.forEach((i, index) => {
        if (i === 0) return;
        for (let j = 0; j < i; j++) {
            res.push(generation[index]);
        }
    });

    return res;
}

// 测试
// console.log(naturalSelectCal(['011110', '100100', '101001', '011110']));


// 交叉运算：繁殖后代
// 先进行随机配对
// 随机设置交叉点位置
// 然后互相替换一部分，产生下一代（数量维持不变）
function getNextGenerationWithoutVariate(generation) {

    // 随机配对，产生没有变异的下一代
    if (!Array.isArray(generation)) return;

    // 根据数组的长度length来判断是否是偶数，奇数情况下随机舍去一个。偶数情况下从0到length-1，随机配对
    let _generation = generation;
    const population = generation.length;
    if (population % 2 !== 0) {
        _generation = _generation.splice(Math.round(Math.random() * (generation.length - 1)), 1)
    }

    // 产生夫妻组合
    const couples = []; // 二维数组
    while (_generation.length > 0) {
        const father = _generation.splice(Math.round(Math.random() * (_generation.length - 1)), 1);
        const mother = _generation.splice(Math.round(Math.random() * (_generation.length - 1)), 1);
        if (Array.isArray(father) && Array.isArray(mother) && father[0] && mother[0]) {
            couples.push([father[0], mother[0]]);
        }
    }
    console.log('夫妻组合', couples);

    // 对夫妻组合遍历，遍历中选择随机交换点，然后产生互相交换，产生下一代
    let nextGeneration = [];
    couples.forEach(i => {
        if (!Array.isArray(i)) return;
        const father = i[0];
        const mother = i[1];
        const pointForChange = Math.round(Math.random() * (father.length - 1));

        const child1 = father.slice(0, pointForChange) + mother.slice(pointForChange, mother.length);
        const child2 = mother.slice(0, pointForChange) + father.slice(pointForChange, father.length);

        nextGeneration = nextGeneration.concat([child1, child2]);
    });

    return nextGeneration
}

// 测试
// console.log(getNextGenerationWithoutVariate(['011110', '100100', '101001', '011110']));


// 变异运算
// 随机选择一个点位
// 将改点位从0改为1
// 返回新的个体
function variation(unit) {
    if (!unit) return;
    const pointForVariate = Math.round(Math.random() * (unit.length - 1));

    let newUnit = unit.split('').map((i, index) => {
        if (index !== pointForVariate) return i;

        if (i === '0') {
            return '1'
        } else {
            return '0';
        }
    }).join('')

    return newUnit;
}

// 测试
// variation('011110');


// 判断这一代当中是否有完美个体
function getTheBestOrNot(generation) {
    if (!Array.isArray(generation)) return;

    let res = false;
    generation.forEach(i => {
        if (i === '111111') {
            res = true;
        }
    });

    return res;
}


// 整体流程:
// 选择计算
// 交叉运算
// 变异运算
// 返回x1*x1 + x2*x2在给定的x1,x2的选择范围内的最大值
function heredityAlgo(x1, x2) {
    let generationTmp;

    // 初始群体产生
    const originalGeneration = getOriginalGeneration(x1, x2);
    generationTmp = originalGeneration;

    let n = 1;
    while (!getTheBestOrNot(generationTmp)) {
        console.log('开始的种群', generationTmp);

        // 适应度计算
        // 选择计算：自然优胜劣汰，判断能否到达下一个阶段，实现繁殖
        const generationAfterSelect = naturalSelectCal(generationTmp);
        console.log('自然选择种群结果', generationAfterSelect);

        // 交叉计算：繁殖后代，
        const nextGenerationWithoutVariate = getNextGenerationWithoutVariate(generationAfterSelect);
        console.log('自然产生下一代，没有变异', nextGenerationWithoutVariate);
        // 如果没有变异，永远是组合。那么如果所有的上一代都有0，那么下一代很难组合出全是1的结果

        // 变异运算，后代随机突变一个点位
        const nextGenerationWithVariate = nextGenerationWithoutVariate.map(i => variation(i));
        console.log('下一代，经过变异', nextGenerationWithVariate);

        generationTmp = nextGenerationWithVariate;
        console.log(`----------------------${n}代结束--------------------------`)
        n += 1;
    }
}


// 测试用例
heredityAlgo(X1, X2);
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
console.log(getNumToBinary(6));


// 获取初始种群
function getOriginalUnits(x1, x2) {
    function getRandomNumInArray(arr) {
        if (!Array.isArray(arr)) return null;
        const index = Math.floor(Math.random() * (arr.length - 1));
        return arr[index];
    }

    let originalPopulation = [];
    for (let i = 0; i < 4; i++) {
        let unitPart1 = getNumToBinary(getRandomNumInArray(x1));
        let unitPart2 = getNumToBinary(getRandomNumInArray(x2));
        console.log('test', unitPart1, unitPart2);
        if (unitPart1 && unitPart2) {
            const unit = unitPart1 + unitPart2;
            originalPopulation.push(unit);
        }
    }

    return originalPopulation;
}

// 测试：获取初始种群
console.log(getOriginalUnits(X1, X2));


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
console.log(getScoreForUnit('111111'));

// 整体流程:
// 选择计算
// 交叉运算
// 变异运算

// 返回x1*x1 + x2*x2在给定的x1,x2的选择范围内的最大值
function heredityAlgo(x1, x2) {
    // 个体编码
    // x1中取一个数字和x2中取一个数字。加起来表示为一个长度为6的0，1组成的字符串。
    // 这样做的愿意是为了后续的变异

    // 初始群体产生: 从x1, x2中随机取一个数字，组合为个体编码。重复四次
    const originalUnits = getOriginalUnits(x1, x2);

    // 适应度计算

    // 选择计算
    // 先计算出群体里面所有个体的适应度的总和 unitSum
    // 计算个体的相对适应度：scoreForUnit / unitSum

}


// 测试用例

heredityAlgo()
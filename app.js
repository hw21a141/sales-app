/* ==================================
   Staff Sales v2
================================== */

let salesData =
JSON.parse(
localStorage.getItem("salesData")
) || [];

const MONTHLY_GOAL = 500000;

let editingId = null;

/* ==================================
   初期化
================================== */

window.onload = () => {

    initializeDates();

    refreshAll();
};

/* ==================================
   日付初期化
================================== */

function initializeDates(){

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const month =
        today.substring(0,7);

    document.getElementById(
        "saleDate"
    ).value = today;

    document.getElementById(
        "dailyDateFilter"
    ).value = today;

    document.getElementById(
        "dailyGraphDate"
    ).value = today;

    document.getElementById(
        "monthlyFilter"
    ).value = month;

    document.getElementById(
        "monthlyGraphDate"
    ).value = month;
}

/* ==================================
   保存
================================== */

function saveData(){

    localStorage.setItem(
        "salesData",
        JSON.stringify(
            salesData
        )
    );
}

/* ==================================
   タブ切替
================================== */

function showPage(page){

    document
    .querySelectorAll(".page")
    .forEach(el => {

        el.classList.remove(
            "active-page"
        );
    });

    document
    .querySelectorAll(".tab")
    .forEach(el => {

        el.classList.remove(
            "active-tab"
        );
    });

    document
    .getElementById(
        "page-" + page
    )
    .classList.add(
        "active-page"
    );

    document
    .getElementById(
        "tab-" + page
    )
    .classList.add(
        "active-tab"
    );
}

/* ==================================
   売上登録
================================== */

function addSale(){

    const staff =
    document
    .getElementById(
        "staffName"
    )
    .value
    .trim();

    const amount =
    Number(
        document
        .getElementById(
            "salesAmount"
        )
        .value
    );

    const date =
    document
    .getElementById(
        "saleDate"
    )
    .value;

    if(
        !staff ||
        amount <= 0 ||
        !date
    ){

        alert(
            "入力内容を確認してください"
        );

        return;
    }

    salesData.push({

        id: Date.now(),

        staff: staff,

        amount: amount,

        date: date

    });

    saveData();

    document.getElementById(
        "staffName"
    ).value = "";

    document.getElementById(
        "salesAmount"
    ).value = "";

    refreshAll();
}

/* ==================================
   履歴
================================== */

function renderHistory(){

    const container =
    document.getElementById(
        "historyList"
    );

    container.innerHTML = "";

    const sorted =
    [...salesData]
    .sort(
        (a,b)=>
        b.id-a.id
    );

    sorted.forEach(item => {

        container.innerHTML += `

        <div class="history-item">

            <div>

                <div class="history-name">
                    ${item.staff}
                </div>

                <div>
                    ¥${item.amount.toLocaleString()}
                </div>

                <div class="history-date">
                    ${item.date}
                </div>

            </div>

            <div class="history-actions">

                <button
                class="small-btn edit-btn"
                onclick="openEditModal(${item.id})">

                編集

                </button>

                <button
                class="small-btn delete-btn"
                onclick="deleteSale(${item.id})">

                削除

                </button>

            </div>

        </div>

        `;
    });
}

/* ==================================
   編集モーダル
================================== */

function openEditModal(id){

    const item =
    salesData.find(
        x => x.id === id
    );

    if(!item){
        return;
    }

    editingId = id;

    document.getElementById(
        "editStaff"
    ).value = item.staff;

    document.getElementById(
        "editAmount"
    ).value = item.amount;

    document.getElementById(
        "editDate"
    ).value = item.date;

    document
    .getElementById(
        "editModal"
    )
    .classList.add(
        "show"
    );
}

function closeModal(){

    editingId = null;

    document
    .getElementById(
        "editModal"
    )
    .classList.remove(
        "show"
    );
}

function saveEdit(){

    const item =
    salesData.find(
        x => x.id === editingId
    );

    if(!item){
        return;
    }

    item.staff =
    document.getElementById(
        "editStaff"
    ).value;

    item.amount =
    Number(
        document.getElementById(
            "editAmount"
        ).value
    );

    item.date =
    document.getElementById(
        "editDate"
    ).value;

    saveData();

    closeModal();

    refreshAll();
}

/* ==================================
   削除
================================== */

function deleteSale(id){

    if(
        !confirm(
            "削除しますか？"
        )
    ){
        return;
    }

    salesData =
    salesData.filter(
        x => x.id !== id
    );

    saveData();

    refreshAll();
}

/* ==================================
   全削除
================================== */

function clearAllData(){

    if(
        !confirm(
            "全て削除しますか？"
        )
    ){
        return;
    }

    salesData = [];

    saveData();

    refreshAll();
}

/* ==================================
   月間売上
================================== */

function renderMonthlyTotal(){

    const month =
    new Date()
    .toISOString()
    .substring(0,7);

    const total =
    salesData

    .filter(
        x =>
        x.date.startsWith(
            month
        )
    )

    .reduce(
        (sum,x)=>
        sum+x.amount,
        0
    );

    document.getElementById(
        "monthlyTotal"
    ).textContent =

    "¥" +

    total.toLocaleString();

    updateGoal(total);
}


/* ==================================
   スタッフ集計
================================== */

function aggregateByStaff(records){

    const result = {};

    records.forEach(item => {

        if(
            !result[item.staff]
        ){

            result[item.staff] = 0;
        }

        result[item.staff] +=
        item.amount;
    });

    return Object
    .entries(result)
    .sort(
        (a,b)=>
        b[1]-a[1]
    );
}

/* ==================================
   TOP3
================================== */

function renderTop3(){

    const month =
    new Date()
    .toISOString()
    .substring(0,7);

    const ranking =

    aggregateByStaff(

        salesData.filter(
            x =>
            x.date.startsWith(
                month
            )
        )
    );

    const medals =

    ["🥇","🥈","🥉"];

    const container =
    document.getElementById(
        "top3Container"
    );

    container.innerHTML = "";

    ranking
    .slice(0,3)
    .forEach(
        (item,index)=>{

        container.innerHTML += `

        <div class="top3-item">

            <div class="top3-rank">
                ${medals[index]}
            </div>

            <div class="top3-name">
                ${item[0]}
            </div>

            <div class="top3-sales">
                ¥${item[1].toLocaleString()}
            </div>

        </div>

        `;
    });
}
/* ==================================
   順位表示
================================== */

function getRankIcon(index){

    if(index === 0){
        return "🥇";
    }

    if(index === 1){
        return "🥈";
    }

    if(index === 2){
        return "🥉";
    }

    return index + 1;
}

/* ==================================
   日別ランキング
================================== */

function renderDailyRanking(){

    const date =
    document.getElementById(
        "dailyDateFilter"
    ).value;

    const records =
    salesData.filter(
        x => x.date === date
    );

    const ranking =
    aggregateByStaff(
        records
    );

    const tbody =
    document.getElementById(
        "dailyRankingBody"
    );

    tbody.innerHTML = "";

    ranking.forEach(
        (item,index)=>{

        tbody.innerHTML += `

        <tr>

            <td>
                ${getRankIcon(index)}
            </td>

            <td>
                ${item[0]}
            </td>

            <td>
                ¥${item[1].toLocaleString()}
            </td>

        </tr>

        `;
    });
}

/* ==================================
   月別ランキング
================================== */

function renderMonthlyRanking(){

    const month =
    document.getElementById(
        "monthlyFilter"
    ).value;

    const records =
    salesData.filter(
        x =>
        x.date.startsWith(
            month
        )
    );

    const ranking =
    aggregateByStaff(
        records
    );

    const tbody =
    document.getElementById(
        "monthlyRankingBody"
    );

    tbody.innerHTML = "";

    ranking.forEach(
        (item,index)=>{

        tbody.innerHTML += `

        <tr>

            <td>
                ${getRankIcon(index)}
            </td>

            <td>
                ${item[0]}
            </td>

            <td>
                ¥${item[1].toLocaleString()}
            </td>

        </tr>

        `;
    });
}

/* ==================================
   日別グラフ
================================== */

function renderDailyGraph(){

    const date =
    document.getElementById(
        "dailyGraphDate"
    ).value;

    const records =
    salesData.filter(
        x => x.date === date
    );

    const ranking =
    aggregateByStaff(
        records
    );

    drawDonutChart(
        ranking,
        "dailyPieChart",
        "dailyLegend"
    );
}

/* ==================================
   月別グラフ
================================== */

function renderMonthlyGraph(){

    const month =
    document.getElementById(
        "monthlyGraphDate"
    ).value;

    const records =
    salesData.filter(
        x =>
        x.date.startsWith(
            month
        )
    );

    const ranking =
    aggregateByStaff(
        records
    );

    drawDonutChart(
        ranking,
        "monthlyPieChart",
        "monthlyLegend"
    );
}

/* ==================================
   ドーナツグラフ
================================== */

function drawDonutChart(
    ranking,
    svgId,
    legendId
){

    const svg =
    document.getElementById(
        svgId
    );

    const legend =
    document.getElementById(
        legendId
    );

    svg.innerHTML = "";
    legend.innerHTML = "";

    if(ranking.length === 0){

        legend.innerHTML =
        "<p>データがありません</p>";

        return;
    }

    const colors = [

        "#F4C9D8",
        "#EAB8CB",
        "#F7DCE6",
        "#FCEEF4",
        "#DDB7C8",
        "#E8CAD5",
        "#F1D8E2",
        "#F8E7EE"

    ];

    const total =
    ranking.reduce(
        (sum,item)=>
        sum + item[1],
        0
    );

    let startAngle = 0;

    ranking.forEach(
        (item,index)=>{

        const value =
        item[1];

        const angle =
        (value / total)
        * Math.PI * 2;

        const endAngle =
        startAngle + angle;

        const radius = 100;

        const x1 =
        150 +
        radius *
        Math.cos(startAngle);

        const y1 =
        150 +
        radius *
        Math.sin(startAngle);

        const x2 =
        150 +
        radius *
        Math.cos(endAngle);

        const y2 =
        150 +
        radius *
        Math.sin(endAngle);

        const largeArc =
        angle > Math.PI
        ? 1
        : 0;

        const path =
        document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
        );

        path.setAttribute(
        "d",
        `
        M150 150
        L${x1} ${y1}
        A${radius} ${radius}
        0
        ${largeArc}
        1
        ${x2} ${y2}
        Z
        `
        );

        path.setAttribute(
        "fill",
        colors[
            index %
            colors.length
        ]
        );

        svg.appendChild(
        path
        );

        const percent =
        (
            value /
            total *
            100
        ).toFixed(1);

        const legendItem =
        document.createElement(
        "div"
        );

        legendItem.className =
        "legend-item";

        legendItem.innerHTML = `

        <div
        class="legend-color"
        style="
        background:
        ${
            colors[
                index %
                colors.length
            ]
        };
        ">
        </div>

        <div>

            <strong>
                ${item[0]}
            </strong>

            <br>

            ¥${value.toLocaleString()}

            (${percent}%)

        </div>

        `;

        legend.appendChild(
        legendItem
        );

        startAngle =
        endAngle;
    });

    /* 中央の穴 */

    const hole =
    document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
    );

    hole.setAttribute(
    "cx",
    "150"
    );

    hole.setAttribute(
    "cy",
    "150"
    );

    hole.setAttribute(
    "r",
    "50"
    );

    hole.setAttribute(
    "fill",
    "#FFFFFF"
    );

    svg.appendChild(
    hole
    );

    /* 合計金額 */

    const amountText =
    document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
    );

    amountText.setAttribute(
    "x",
    "150"
    );

    amountText.setAttribute(
    "y",
    "145"
    );

    amountText.setAttribute(
    "text-anchor",
    "middle"
    );

    amountText.setAttribute(
    "font-size",
    "12"
    );

    amountText.setAttribute(
    "fill",
    "#A8979F"
    );

    amountText.textContent =
    "合計";

    svg.appendChild(
    amountText
    );

    const totalText =
    document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
    );

    totalText.setAttribute(
    "x",
    "150"
    );

    totalText.setAttribute(
    "y",
    "165"
    );

    totalText.setAttribute(
    "text-anchor",
    "middle"
    );

    totalText.setAttribute(
    "font-size",
    "16"
    );

    totalText.setAttribute(
    "font-weight",
    "bold"
    );

    totalText.setAttribute(
    "fill",
    "#6D5A63"
    );

    totalText.textContent =

    "¥" +
    total.toLocaleString();

    svg.appendChild(
    totalText
    );
}

/* ==================================
   全画面更新
================================== */

function refreshAll(){

    renderHistory();

    renderMonthlyTotal();

    renderTop3();

    renderDailyRanking();

    renderMonthlyRanking();

    renderDailyGraph();

    renderMonthlyGraph();
}

/* ==================================
   モーダル外クリック
================================== */

window.addEventListener(
"click",
function(event){

    const modal =
    document.getElementById(
        "editModal"
    );

    if(
        event.target === modal
    ){

        closeModal();
    }
});
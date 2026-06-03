/* ===================================
   データ管理
=================================== */

let salesData =
JSON.parse(
    localStorage.getItem("salesData")
) || [];

/*
データ構造

[
    {
        id: 1,
        staff: "田中",
        amount: 12000,
        date: "2026-08-01"
    }
]
*/

function saveData(){

    localStorage.setItem(
        "salesData",
        JSON.stringify(salesData)
    );
}

/* ===================================
   初期化
=================================== */

window.onload = () => {

    initializeDates();

    renderHistory();

    renderDailyRanking();

    renderMonthlyRanking();

    renderDailyGraph();

    renderMonthlyGraph();
};

/* ===================================
   今日の日付設定
=================================== */

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

/* ===================================
   ページ切替
=================================== */

function showPage(page){

    document
        .querySelectorAll(".page")
        .forEach(el=>{

            el.classList.remove(
                "active-page"
            );
        });

    document
        .querySelectorAll(".tab")
        .forEach(el=>{

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

/* ===================================
   売上登録
=================================== */

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

        staff,

        amount,

        date
    });

    saveData();

    document
        .getElementById(
            "staffName"
        )
        .value = "";

    document
        .getElementById(
            "salesAmount"
        )
        .value = "";

    refreshAll();
}

/* ===================================
   全再描画
=================================== */

function refreshAll(){

    renderHistory();

    renderDailyRanking();

    renderMonthlyRanking();

    renderDailyGraph();

    renderMonthlyGraph();
}

/* ===================================
   履歴表示
=================================== */

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
            b.id - a.id
        );

    sorted.forEach(item=>{

        const div =
        document.createElement(
            "div"
        );

        div.className =
            "history-item";

        div.innerHTML = `

        <div class="history-left">

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
            onclick="editSale(${item.id})">

            編集

            </button>

            <button
            class="small-btn delete-btn"
            onclick="deleteSale(${item.id})">

            削除

            </button>

        </div>
        `;

        container.appendChild(div);
    });
}

/* ===================================
   編集
=================================== */

function editSale(id){

    const record =
        salesData.find(
            x => x.id === id
        );

    if(!record){
        return;
    }

    const staff =
        prompt(
            "スタッフ名",
            record.staff
        );

    if(
        staff === null
    ){
        return;
    }

    const amount =
        prompt(
            "売上",
            record.amount
        );

    if(
        amount === null
    ){
        return;
    }

    const date =
        prompt(
            "日付",
            record.date
        );

    if(
        date === null
    ){
        return;
    }

    record.staff =
        staff.trim();

    record.amount =
        Number(amount);

    record.date =
        date;

    saveData();

    refreshAll();
}

/* ===================================
   削除
=================================== */

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

/* ===================================
   全削除
=================================== */

function resetAllData(){

    if(
        !confirm(
            "全データを削除しますか？"
        )
    ){
        return;
    }

    salesData = [];

    saveData();

    refreshAll();
}

/* ===================================
   集計処理
=================================== */

function aggregateByStaff(records){

    const result = {};

    records.forEach(item=>{

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

/* ===================================
   順位表示
=================================== */

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

/* ===================================
   日別ランキング
=================================== */

function renderDailyRanking(){

    const date =
        document
        .getElementById(
            "dailyDateFilter"
        )
        .value;

    const records =
        salesData.filter(
            x => x.date === date
        );

    const ranking =
        aggregateByStaff(
            records
        );

    const tbody =
        document
        .getElementById(
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
/* ===================================
   月別ランキング
=================================== */

function renderMonthlyRanking(){

    const month =
        document
        .getElementById(
            "monthlyFilter"
        )
        .value;

    const records =
        salesData.filter(
            x => x.date.startsWith(month)
        );

    const ranking =
        aggregateByStaff(records);

    const tbody =
        document
        .getElementById(
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

/* ===================================
   日別グラフ
=================================== */

function renderDailyGraph(){

    const date =
        document
        .getElementById(
            "dailyGraphDate"
        )
        .value;

    const records =
        salesData.filter(
            x => x.date === date
        );

    const ranking =
        aggregateByStaff(records);

    drawPieChart(
        ranking,
        "dailyPieChart",
        "dailyLegend"
    );
}

/* ===================================
   月別グラフ
=================================== */

function renderMonthlyGraph(){

    const month =
        document
        .getElementById(
            "monthlyGraphDate"
        )
        .value;

    const records =
        salesData.filter(
            x =>
            x.date.startsWith(month)
        );

    const ranking =
        aggregateByStaff(records);

    drawPieChart(
        ranking,
        "monthlyPieChart",
        "monthlyLegend"
    );
}

/* ===================================
   円グラフ描画
=================================== */

function drawPieChart(
    ranking,
    svgId,
    legendId
){

    const svg =
        document
        .getElementById(svgId);

    const legend =
        document
        .getElementById(legendId);

    svg.innerHTML = "";
    legend.innerHTML = "";

    if(
        ranking.length === 0
    ){

        legend.innerHTML =
        "<p>データなし</p>";

        return;
    }

    const colors = [

        "#007AFF",
        "#34C759",
        "#FF9500",
        "#AF52DE",
        "#FF2D55",
        "#5AC8FA",
        "#FFCC00",
        "#8E8E93",
        "#5856D6",
        "#FF3B30"
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
            value / total *
            Math.PI * 2;

        const endAngle =
            startAngle + angle;

        const x1 =
            150 +
            120 *
            Math.cos(
                startAngle
            );

        const y1 =
            150 +
            120 *
            Math.sin(
                startAngle
            );

        const x2 =
            150 +
            120 *
            Math.cos(
                endAngle
            );

        const y2 =
            150 +
            120 *
            Math.sin(
                endAngle
            );

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
            A120 120 0
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

        svg.appendChild(path);

        const percent =
            (
                value /
                total *
                100
            )
            .toFixed(1);

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
}

/* ===================================
   ユーティリティ
=================================== */

function formatYen(value){

    return "¥" +
    Number(value)
    .toLocaleString();
}

/* ===================================
   デバッグ用
=================================== */

function dumpData(){

    console.log(
        salesData
    );
}
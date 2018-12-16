let chart;
async function getDataJsonFromUrl(url) {
    return await fetch(url).then(r => r.json());
};

function chartdata(interactions) {
    return interactions.reduce((prev, obj) => {
        prev[obj.brandName] = (prev[obj.brandName] || 0) + 1;
        return prev;
     }, {});
};

function formatData(interactions, brands, users) {
    return interactions.map(item => {
        var user = users.find(user => user.id === item.user);
        var brand = brands.find(brand => brand.id === item.brand);

        item.userName = `${user.name.first} ${user.name.last}`;
        item.brandName = brand.name;

        return item;
    }, []);
};

function createChart(interactions) {
    const data = chartdata(interactions);
    const result = Array.from(Object.keys(data), k => data[k]);
    const labels = Array.from(Object.keys(data), (k, i) => k);

    chart = new Chart(document.getElementById("myChart"), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data: result,
                backgroundColor: 'transparent',
                borderColor: ["pink", "blue", "orange", "green", "red"],
                borderWidth: 4,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false,
            }
        }
    });
}

async function init() {
    const interactions = await getDataJsonFromUrl('https://raw.githubusercontent.com/alexandre-gauge/frontend_data/master/interactions.json');
    const brands = await getDataJsonFromUrl('https://raw.githubusercontent.com/alexandre-gauge/frontend_data/master/brands.json');
    const users = await getDataJsonFromUrl('https://raw.githubusercontent.com/alexandre-gauge/frontend_data/master/users.json');

    window.interactions = formatData(interactions, brands, users);
    
    // create chart
    createChart(interactions);

    // create table rows
    interactions.map(item => {  
        document.getElementById('table-body').innerHTML += 
        `<tr>
            <td>${item.userName}</td>
            <td class="text-center">${item.brandName}</td>
            <td class="text-center">${item.type}</td>
            <td class="text-center">${item.text}</td>
        </tr>`
    });

    // create options of brand select field
    brands.map(item => {  
        document.getElementById('brands').innerHTML += 
        `<option value="${item.id}">${item.name}</option>`
    });
}

function searchData(value) {
    var result = [];
    interactions.forEach(item => {
       if (item.brand === value) {
           result.push(item);
       }
    });

    return result;
}

function search() {
    const value = +($('#brands').val());
    const data = value > 0 ? searchData(value) : window.interactions;

    // remove chart
    chart.destroy();
    // clear table data
    $('#table-body').html('');

    // create new chart
    createChart(data);    
    // create new table rows
    data.map(item => {  
        document.getElementById('table-body').innerHTML += 
        `<tr>
            <td>${item.userName}</td>
            <td class="text-center">${item.brandName}</td>
            <td class="text-center">${item.type}</td>
            <td class="text-center">${item.text}</td>
        </tr>`
    });    
}

init();
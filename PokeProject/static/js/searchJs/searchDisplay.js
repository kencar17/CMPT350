var w = 769;
var h = 628;
var r = 40;
var h1 = r+20;
var h5 = h - h1;
var h3 = h/2;
var hi = (h3-h1)/2;
var h4 = h3+hi;
var h2 = h1+hi;
var w1 = h1;
var w5 = w/2;
var w9 = w-w1;
var wi = (w5-w1)/2;
var w3 = w1 + wi;
var w7 = w5 + wi;
wi = (w3-w1)/2;
var w2 = w1 + wi;
var w4 = w3 + wi;
var w6 = w5 + wi;
var w8 = w7 + wi;
var dataset = [
    [w5,h3,0,0],
    [w2,h2,0,0],
    [w8,h4,0,0],
    [w8,h2,0,0],
    [w2,h4,0,0],
    [w5,h1,0,0],
    [w5,h5,0,0],
    [w4,h2,0,0],
    [w6,h4,0,0],
    [w6,h2,0,0],
    [w4,h4,0,0],
    [w3,h1,0,0],
    [w7,h5,0,0],
    [w7,h1,0,0],
    [w3,h5,0,0],
    [w3,h3,0,0],
    [w7,h3,0,0],
    [w1,h1,0,0],
    [w9,h5,0,0],
    [w9,h1,0,0],
    [w1,h5,0,0],
    [w1,h3,0,0],
    [w9,h3,0,0]];


for (var i = 0; i<23; i++){
    var num = Math.floor(Math.random()*1000)+26;
    dataset[i][2] = Math.floor(Math.random()*721)+1;
    dataset[i][3]=num;
}

var offset = d3.scale.linear()
    .domain(minmax(dataset))
    .range([-2,30]);

var rScale =  d3.scale.linear()
    .domain(minmax(dataset))
    .range([25,60]);

for (i = 0; i < 23; i++){
    $('#image'+i+' image').attr('y',offset(dataset[i][3]))
        .attr('x',offset(dataset[i][3]))
        .attr('xlink:href','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+dataset[i][2]+'.png');
}

function minmax(dataset) {
    var min = dataset[0][3];
    var max = dataset[0][3];
    for (var i = 1; i<23; i++){
        if (dataset[i][3] != 0) {
            if (dataset[i][3] < min){
                min = dataset[i][3];
            }
            if (dataset[i][3] > max){
                max = dataset[i][3];
            }
        }
    }
    return [min,max];
}

var url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png';

var svg = d3.select('#mydiv').append('svg').attr('height', h).attr('width', w);

svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr('cx',function (d) {
        return d[0];
    })
    .attr('cy',function (d) {
        return d[1];
    })
    .attr('r', function (d) {
        return rScale(d[3]);
    })
    .style('fill', function (d,i) {
        return 'url(#image'+i+')';
    })
    .attr('stroke','black');

function updater(dataset,svg,rScale,offset) {

    var generation = document.getElementById("genBody").value;
    var type = document.getElementById("typeBody").value;
    var color = document.getElementById("colorBody").value;
    var weight = document.getElementById("amountW").value;
    var height = document.getElementById("amountH").value;
    var hp = document.getElementById("amountHP").value;
    var attack = document.getElementById("amountA").value;
    var defense = document.getElementById("amountD").value;
    var sp_attack = document.getElementById("amountSA").value;
    var sp_defense = document.getElementById("amountSD").value;
    var speed = document.getElementById("amountSP").value;
    var radio = document.querySelector('input[name = "optradio"]:checked').value;


    console.log(generation, type, color, weight, height, hp, attack, defense, sp_attack, sp_defense, speed, radio);
    $.ajax({
        type: "GET",
        url: 'ajax/get_filtered_pokemon/', //the script to call to get data
        data: {"gen": generation, "type":type, "color": color, "weight": weight, "height": height, "hp": hp,
            "attack": attack, "defense": defense, "sp_attack": sp_attack, "sp_defense": sp_defense, "speed": speed,
        "radio": radio},
        dataType: 'JSON',                //data format
    success: function(pokemons) {
        console.log(pokemons);
        for (var i = 0 ; i < pokemons.length; i++){
            pokemonSearchData.push(pokemons[i]);
                console.log(i + ':' + pokemons[i].name);

        }



    },
    failure: function(pokemons) {
        alert('Got an error dude');
    }
    });


    for (var i = 0; i < 23; i++) {
        var num = Math.floor(Math.random() * 35) + 26;
        dataset[i][3] = num;
        dataset[i][2] = Math.floor(Math.random() * 721) + 1;
    }

    rScale.domain(minmax(dataset));
    offset.domain(minmax(dataset));

    for (i = 0; i < 23; i++) {
        $('#image' + i + ' image').attr('y', offset(dataset[i][3]))
            .attr('x', offset(dataset[i][3]))
            .attr('xlink:href', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + dataset[i][2] + '.png');
    }
    svg.selectAll("circle")
        .attr('r', function (d) {
            return rScale(d[3]);
        })
}

d3.select('#genBody').on('change', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#typeBody').on('change', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#colorBody').on('change', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#slider-range').on('click', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#slider-range2').on('click', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#slider-range3').on('click', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#slider-range4').on('click', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#slider-range5').on('click', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#slider-range6').on('click', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#slider-range7').on('click', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#slider-range8').on('click', function () {
    updater(dataset,svg,rScale,offset);
});

d3.select('#StatRadio').on('change', function () {
    updater(dataset,svg,rScale,offset);
});
var map = L.map(document.getElementById('mapDIV'),
{ center: [41.8503797,-8.1323978],
    zoom: 10
});

//BASEMAP
let basemap =L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    {
    });
basemap.addTo(map);

//POLIGONO DO PNPG                
var thePNPG= L.geoJSON(PNPG, {
        color: '#77C66E',
        weight: 1,
        onEachFeature: function(feature, layer){
            layer.on('click', function (){
            document.getElementById('info').innerHTML="<h2>Parque Nacional da Peneda-Gerês (PNPG)</h2>" + "<p> Criado com o Decreto-Lei nº187/71 de 8 de maio, estando assim inserida na Rede Nacional de Áreas Protegidas (RNAP). Detém uma área de 69595 ha e é caracterizada por ter um património cultural e natural diversificado e único reconhecido internacionalmente. Desta forma, esta Área Protegida recebe um grande número de visitantes nacionais e internacionais.</p>" + "<ul>Sendo uma Área Protegida, este Parque divide-se em vários níveis de proteção:<li>Áreas de proteção total e Áreas de proteção parcial do tipo I e II(áreas naturais onde há uma reduzida presença humana e alteração de ecossistemas);</li> <li>Áreas de proteção complementar do tipo I e II(Proteção Complementar: áreas rurais onde estão a maioria das atividades humanas).</li></ul>" + '<img src="./MAPA/Protecao.jpg" width="200" height="271">' + '<p>Área de proteção do PNPG (Fonte: ICNF, 2013)</p><p>Para saber mais informações, consulte o <a href="http://www2.icnf.pt/portal/ap/pnpg">site do ICNF<a/></p>';});
        }
    });
thePNPG.bindTooltip('Parque Nacional da Peneda-Gerês');
thePNPG.addTo(map);

//LINHAS DE TRILHOS
var trilhos = L.geoJSON(FeatureCollections, {
        color:"#000000", 
        weight:2, 
        onEachFeature: function(feature, layer){
            layer.on('click', function (){
                document.getElementById('info').innerHTML='<h2>Trilhos do PNPG</h2>' + '<p>É muito recorrente os visitantes efetuarem diversos trilhos no Parque para aproveitarem a paisagem natural e geossítios interessantes que intersetam estes trilhos. Atualmente existem dois tipos de trilhos: <a href="http://adere-pg.pt/trilhos/percursos1.php">os oficiais do PNPG<a> e os trilhos feitos por visitantes e partilhados em aplicações como Wikiloc ou até em blog. Neste caso, estes trilhos foram retirados do site <a href="https://www.vagamundos.pt/melhores-trilhos-do-geres/">"https://www.vagamundos.pt/melhores-trilhos-do-geres/"</a>, sendo estes visitantes que percorreram trilhos oficiais e partilharam essa informação ao público.' + '<p>Clique em algum elemento da Layer Trilhos para mais informação</p>'});
        layer.bindPopup('<p><strong>' + feature.properties.Name + '</strong></p>' + '<p><strong>Distância:</strong>' + feature.properties.Length + 'Km' + '</p>');
        }
    });
trilhos.addTo(map);


//POP-UP COM COORDENADAS DE ONDE SE CLICA
var popup = L.popup();
function onMapClick(e) {
popup
    .setLatLng(e.latlng)
    .setContent("Clicou no mapa em " + e.latlng.toString().substring(7,e.latlng.toString().length-1))
    .openOn(map);
}
map.on('click', onMapClick);
        
//CARACTERÍSTICAS DO ICON EM CÍRCULO
const geojsonMarkerOptions= {
    radius:6, 
    fillColor:"#ff7800",
    color: "#000",
    weight:1, 
    opacity:1, 
    fillOpacity:0.8
};

//ADIÇÃO DE PONTOS COM POP-UP COM IMAGENS AO CLICAR E AINDA INFO EM CAIXA "INFO" E APLICAR ESTES PONTOS NO MARKERCLUSTERGROUP PARA ELES AGRUPAREM-SE
const markers = L.markerClusterGroup();
    var pontos = L.geoJSON(data, {

        onEachFeature: function (feature, layer) //functionality on click on feature
    {    
        layer.on('click', function (){
            document.getElementById('info').innerHTML='<h2> Fotografias Recolhidas via FLICKR </h2>' + '<p> Os pontos representados no mapa são referentes às fotografias feitas pelos visitantes do parque que são utilizadores do FLICKR. A extração destas fotos permite recolher diversos dados acerca da fotografia e o utilizador que postou a fotografia, a destacar os dados de localização e ainda a data e a hora em que a foto foi tirada. Estes dados possibilitam realizar uma análise espacial e temporal a nível anual, mensal e diário.</p>' + "<iframe src='https://flo.uri.sh/visualisation/8281392/embed' title='Interactive or visual content' class='flourish-embed-iframe' frameborder='0' scrolling='no' style='width:80%;height:400px;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe><div style='width:100%!;margin-top:4px!important;text-align:right!important;'><a class='flourish-credit' href='https://public.flourish.studio/visualisation/8281392/?utm_source=embed&utm_campaign=visualisation/8281392' target='_top' style='text-decoration:none!important'><img alt='Made with Flourish' src='https://public.flourish.studio/resources/made_with_flourish.svg' style='width:105px!important;height:16px!important;border:none!important;margin:0!important;'> </a></div>"+ "<p><b>Distribuição anual, mensal e diário dos visitantes do PNPG.</b></p>"});
    },
    pointToLayer: circulo, 
    });
    
    function circulo (pontos, latlng){
        var att=pontos.properties;
        return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup('<img src ="' + att.url_sq +'"style="width: 120px; height:120px;">' + '<p><strong>Concelho:</strong>' +  att.Concelho + '</p>' + '<p><strong> Freguesia:</strong>' + att.Freguesia + '</p>' + '<p><strong>Coordenadas:</strong>' + att.y + ', ' + att.x);
    };
markers.addLayer(pontos);
map.addLayer(markers);

//ADIÇÃO DA ESCALA
var scale = L.control.scale();
scale.addTo(map);

//FAZER UM HEATMAP
var heatMapPoints = [];
var pontos= L.geoJSON(data, {
    onEachFeature: function (feature){
        heatMapPoints.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
    }
});
//CARACTERÍSTICAS DO HEATMAP
var heat = L.heatLayer(heatMapPoints,{
    minOpacity: 0.4,
    radius: 15,
    gradient: {0.4: 'blue', 0.5: 'lime', 0.6: 'red'}}).addTo(map);

//PERFIL TOPOGRÁFICO DOS PERFIS (AINDA COM PROBLEMAS, FAZ GRÁFICO UNICO PARA TODOS)
var el = L.control.elevation({
    position: "bottomright",
      theme: "magenta-theme", 
      useHeightIndicator: true, 
      collapsed: false, 
      detached: false, 
      preferCanvas:true,
      width: 300,
      height:150
  });
el.addTo(map);
var myStyle = {
    "color": "#ff7800",
    "weight": 4,
};

var geojson = L.geoJson(FeatureCollections,{
    style:myStyle,
    onEachFeature:
        el.addData.bind(el)
}).addTo(map);

//Criar ICON para adicionar em pontosInteresse
var Icon = L.icon({
    iconUrl:'./MAPA/turismo.png',
    iconSize:[40,40],
});
//ADIÇÃO DE PONTOSINTERESSE E ADIÇÃO DE INFORMAÇÃO AO CLICAR NOS PONTOS
var pontosInteresse=L.geoJSON(pontos_interesse,
    {pointToLayer:visita,
    onEachFeature:function(feature, layer){
        layer.on('click', function (){
            document.getElementById('info').innerHTML='<h2>'+ feature.properties.Name + '</h2>' + '<p>' + feature.properties.Descricao +'</p>' + '<img src=' + feature.properties.image + ' width="450" height="300">' + "<p><b>Fonte:" + feature.properties.url + "</b></p>"});   
    }
}).addTo(map);
//FUNÇÃO PARA ADICIONAR ICON
    function visita(geoJSON, latlng){
        return L.marker(latlng,{icon:Icon});
    };
//ADIÇÃO DE BUUFER DE 500M DA REDE VIÁRIA
var bufffer_vias=L.geoJSON(rede_viaria,{
     color: '#DC143C',
     weight: 1,
     onEachFeature:function(feature, layer){
        layer.on('click', function (){
            document.getElementById('info').innerHTML='<h2>Rede Viária</h2>' + '<p>Este buffer de 500m foi realizado para entender a influência que a rede viária tem na distribuição espacial dos visitantes. Desta forma, observa-se que a maioria dos pontos estão contidos neste buffer, sendo assim um dos fatores que influenciam esta distribuição. Estes dados foram extraídos do OpenStreetMap podem ter assim alguns erros.</p>' + '<p> Além deste fator, existe ainda os pontos de interesse e a rede hidrográfica que foram colocados para justificar a distribuição apresentada.'
        })}}).addTo(map);
//ADIÇÃO DE REDE HIDROGRÁFICA
var rede_hidro=L.geoJSON(rede_hidro,{
    color: '#00008B',
    weight: 1.5,
    onEachFeature:function(feature, layer){
        layer.on('click', function (){
            document.getElementById('info').innerHTML='<h2>Rede Hidrográfica</h2>' + '<p>Os cursos de água são geralmente atrativos para os visitantes principalmente pelas cascatas e beleza natural que esta proporciona para o ambiente. Tendo alguns pontos perto desta rede, poderá ser um fator de influência à atratividade de turistas para o PNPG.</p>' 
        })}}).addTo(map);
//Adição da Orientação
var north = L.control({position: "topleft"});
north.onAdd = function(map) {
var div = L.DomUtil.create("div", "info legend");
    div.innerHTML = '<img src="direction.png">';
    return div;
}

north.addTo(map);

//PARA FAZER LEGENDA
var base= {'Basemap': basemap};
var shapes={
        'Fotografias Coletadas':markers,
        'PNPG':thePNPG, 
        'Trilhos':trilhos,
        'Heatmap': heat,
        'Linhas do Gráfico': geojson,
        'Pontos de interesse': pontosInteresse,
        'Buffer 500m: Rede Viária': bufffer_vias,
        'Rede hidrográfica': rede_hidro
    };
L.control.layers(base, shapes).addTo(map);
from django.http import HttpResponse
from django.shortcuts import render
from PokeVis.models import Pokemon
from django.core import serializers
from django.db.models import Q
from PokeVis.poke import Poke
from PokeVis.searchData import SearchData

import json

# Create your views here.
from django.views import generic

'''
class KenView(generic.TemplateView):
    template_name = 'ken.html'
    '''
def KenView(request):
    pokemons = Pokemon.objects.filter(generation='1')
    data = serializers.serialize("json", pokemons)
    colors = ['Green', 'Red', 'Blue', 'White', 'Brown', 'Yellow', 'Purple', 'Pink', 'Grey', 'Black']
    types = ["Fire", "Water", "Grass", "Bug", "Ghost", "Electric", "Fairy", "Dragon", "Poison",
             "Rock", "Steel", "Normal", "Fighting", "Ground", "Psychic"]
    return render(request, 'ken.html', {'file': data, 'color': colors, 'types': types})


class JordanView(generic.TemplateView):
    template_name = 'jordan.html'


class LiamView(generic.TemplateView):
        template_name = 'liam.html'


class GrahamView(generic.TemplateView):
    template_name = 'graham.html'

'''
class SearchView(generic.TemplateView):
    template_name = 'search.html'
'''


def SearchView(request):
    types = ["Fire", "Water", "Grass", "Bug", "Ghost", "Electric", "Fairy", "Dragon", "Poison",
             "Rock", "Steel", "Normal", "Fighting", "Ground", "Psychic", "Ice", "Dark", "Flying"]
    colors = ['Green', 'Red', 'Blue', 'White', 'Brown', 'Yellow', 'Purple', 'Pink', 'Grey', 'Black']
    pokemons = Pokemon.objects.all()
    data = serializers.serialize("json", pokemons)
    return render(request, 'search.html', {'types': types, 'colors': colors, 'pokemon': data})



def OverviewView(request):
    return render(request, 'overview.html', {})


def PcomparisionView(request):
    temp_array = []
    pokemons = Pokemon.objects.all()

    for item in pokemons:
        poke = Poke(item.number, item.total, item.hp, item.attack, item.defense, item.special_attack,
                    item.special_defense, item.speed, item.weight_kg, item.height_m, item.color, item.name)
        temp_array.append(poke)

    return render(request, 'pcomparision.html', {'pokemon': temp_array})


def TcomparisionView(request):
    return render(request, 'tcomparision.html', {})


def BattleView(request):
    return render(request, 'battle.html', {})


def get_filter_options(request):
    temp_array = []
    type_val = request.GET.get('type', None)

    if type_val == 'All Types':
        pokemons = Pokemon.objects.all()
    else:
        pokemons = Pokemon.objects.filter(type_1=type_val)

    for item in pokemons:
        poke = Poke(item.number, item.total, item.hp, item.attack, item.defense, item.special_attack,
                    item.special_defense, item.speed, item.weight_kg, item.height_m, item.color, item.name)
        temp_array.append(poke)

    json_string = json.dumps([ob.__dict__ for ob in temp_array])

    return HttpResponse(json_string, content_type='application/json')


def get_pokemon(request):
    temp_array = []

    pokemons = Pokemon.objects.all()

    for item in pokemons:
        poke = Poke(item.number, item.total, item.hp, item.attack, item.defense, item.special_attack,
                    item.special_defense, item.speed, item.weight_kg, item.height_m, item.color, item.name)
        temp_array.append(poke)

    json_string = json.dumps([ob.__dict__ for ob in temp_array])

    return HttpResponse(json_string, content_type='application/json')


def get_single_pokemon(request):
    temp_array = []
    name_val = request.GET.get('name', None)

    if Pokemon.objects.filter(name=name_val).exists():

        pokemons = Pokemon.objects.filter(name=name_val)

        for item in pokemons:
            poke = Poke(item.number, item.total, item.hp, item.attack, item.defense, item.special_attack,
                        item.special_defense, item.speed, item.weight_kg, item.height_m, item.color, item.name,
                        item.egg_group_1, item.egg_group_2, item.generation, item.catch_rate, item.is_legendary,
                        item.body_style, item.type_1, item.type_2, 0)
            temp_array.append(poke)

        json_string = json.dumps([ob.__dict__ for ob in temp_array])

        return HttpResponse(json_string, content_type='application/json')

    else:
        poke = Poke()
        temp_array.append(poke)

        json_string = json.dumps([ob.__dict__ for ob in temp_array])
        return HttpResponse(json_string, content_type='application/json')


def get_filtered_pokemon(request):
    temp_array = []
    pokemons = []
    new = []

    gen_val = request.GET.get('gen', None)
    type_val = request.GET.get('type', None)
    color_val = request.GET.get('color', None)
    weight_val = request.GET.get('weight', None)
    height_val = request.GET.get('height', None)
    hp_val = request.GET.get('hp', None)
    attack_val = request.GET.get('attack', None)
    defense_val = request.GET.get('defense', None)
    sp_attack_val = request.GET.get('sp_attack', None)
    sp_defense_val = request.GET.get('sp_defense', None)
    speed_val = request.GET.get('speed', None)
    radio = request.GET.get('radio', None)

    pokemons = Pokemon.objects.all()

    if gen_val != "All Generations":
        temp = gen_val.split(" ")
        new = pokemons.filter(generation=temp[1])
    else:
        new = pokemons
    if type_val != "All Types":
        new = new.filter(Q(type_1=type_val) | Q(type_2=type_val))
    if color_val != "All Colors":
        new = new.filter(color=color_val)

    # Weight
    temp = weight_val.split(" - ")
    new = new.filter(Q(weight_kg__gte=int(temp[0])) & Q(weight_kg__lte=temp[1]))

    # Height
    temp = height_val.split(" - ")
    new = new.filter(Q(height_m__gte=int(temp[0])) & Q(height_m__lte=temp[1]))

    # Hp
    temp = hp_val.split(" - ")
    new = new.filter(Q(hp__gte=int(temp[0])) & Q(hp__lte=temp[1]))

    # Attack
    temp = attack_val.split(" - ")
    new = new.filter(Q(attack__gte=int(temp[0])) & Q(attack__lte=temp[1]))

    # Defense
    temp = defense_val.split(" - ")
    new = new.filter(Q(defense__gte=int(temp[0])) & Q(defense__lte=temp[1]))

    # Sp Attack
    temp = sp_attack_val.split(" - ")
    new = new.filter(Q(special_attack__gte=int(temp[0])) & Q(special_attack__lte=temp[1]))

    # Sp Defense
    temp = sp_defense_val.split(" - ")
    new = new.filter(Q(special_defense__gte=int(temp[0])) & Q(special_defense__lte=temp[1]))

    # Speed
    temp = speed_val.split(" - ")
    new = new.filter(Q(speed__gte=int(temp[0])) & Q(speed__lte=temp[1]))

    # Passing back data: what ever radio button is selected -> stat value. name, pokedex, height, weight

    for item in new:
        # if radio == "total":
        #     poke = SearchData(item.number, item.total, item.weight_kg, item.height_m, item.name)
        # elif radio == "hp":
        #     poke = SearchData(item.number, item.hp, item.weight_kg, item.height_m, item.name)
        # elif radio == "attack":
        #     poke = SearchData(item.number, item.attack, item.weight_kg, item.height_m, item.name)
        # elif radio == "defense":
        #     poke = SearchData(item.number, item.defense, item.weight_kg, item.height_m, item.name)
        # elif radio == "sp_attack":
        #     poke = SearchData(item.number, item.special_attack, item.weight_kg, item.height_m, item.name)
        # elif radio == "sp_defense":
        #     poke = SearchData(item.number, item.special_defense, item.weight_kg, item.height_m, item.name)

        poke = SearchData(item.number, item.weight_kg, item.height_m, item.name, item.total,
                          item.hp, item.attack, item.defense, item.special_attack, item.special_defense, item.speed,
                          item.type_1, item.type_2)

        temp_array.append(poke)

    json_string = json.dumps([ob.__dict__ for ob in temp_array])

    return HttpResponse(json_string, content_type='application/json')


def get_data(request):
    pokemonDictionary = {"name": "Pokemon", "color": "#F0F0FF"}
    colorsDict = {"Fire": "#ff5d55", "Water": "#5382ea", "Grass": "#6cb649", "Bug": "#95a22c", "Ghost": "#5d4b7e",
                  "Electric": "#f2c735", "Fairy": "#e287e2", "Dragon": "#5b2eef", "Poison": "#933f93",
                  "Rock": "#a48f3a", "Steel": "#a7a8be", "Normal": "#99986a", "Fighting": "#a02a26",
                  "Ground": "#d9b34a", "Psychic": "#f54378", "Ice": "#84cfcf", "Flying": "#9d88db", "Dark": "#5d483d"}
    tempGendict = []
    type = set()
    size = 1000

    for i in range(1, 7):
        pokelist = Pokemon.objects.filter(generation=str(i))
        for j in pokelist:
            type.add(j.type_1)
        tempTypeArray = []
        for ty in type:
            refinedlist = Pokemon.objects.filter(generation=str(i), type_1=ty)
            temp = []
            for k in refinedlist:
                temp.append({"name": k.name, "pokeId": k.id, "size": size})
            tempTypeArray.append({"name": ty, "children": temp, "color": colorsDict[ty]})

        tempGendict.append({"name": "Generation " + str(i), "color": "#000000", "children": tempTypeArray})

        type.clear()

    pokemonDictionary["children"] = tempGendict

    json_string = json.dumps(pokemonDictionary)

    return HttpResponse(json_string, content_type='application/json')


def exists(request):
    name_val = request.GET.get('name', None)

    if Pokemon.objects.filter(name=name_val).exists():
        val = {"val": 0}
    else:
        val = {"val": 1}

    json_string = json.dumps(val)
    return HttpResponse(json_string, content_type='application/json')

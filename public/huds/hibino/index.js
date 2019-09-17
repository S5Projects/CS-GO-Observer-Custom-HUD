
var teams = {
    left: {},
    right: {}
}
let left_he_grenades = 0;
let left_flash_grenades = 0;
let left_smoke_grenades = 0;
let left_fire_grenades = 0;
let left_decoy_grenades = 0;
let right_he_grenades = 0;
let right_flash_grenades = 0;
let right_smoke_grenades = 0;
let right_fire_grenades = 0;
let right_decoy_grenades = 0;
let timeout_set = false;
let timeout_left = 0;
let timeout_right = 0;

var pause_set = false;

let player1hp = 0;
let player2hp = 0;
let player3hp = 0;
let player4hp = 0;
let player5hp = 0;
let player6hp = 0;
let player7hp = 0;
let player8hp = 0;
let player9hp = 0;
let player10hp = 0;

let player1death = false;
let player2death = false;
let player3death = false;
let player4death = false;
let player5death = false;
let player6death = false;
let player7death = false;
let player8death = false;
let player9death = false;
let player10death = false;

var freezetime = false;

var start_money = {};

function fillObserved(player) {
    let statistics = player.getStats();
    let weapons = player.weapons;
    let right = false;
    var obplayer = 0;

    if (player.observer_slot >= 1 && player.observer_slot <= 5) {
        right = true;
    }
    $("#playerob_right").find("#player1ob").css("visibility", "hidden");
    $("#playerob_right").find("#player2ob").css("visibility", "hidden");
    $("#playerob_right").find("#player3ob").css("visibility", "hidden");
    $("#playerob_right").find("#player4ob").css("visibility", "hidden");
    $("#playerob_right").find("#player5ob").css("visibility", "hidden");
    $("#playerob_left").find("#player1ob").css("visibility", "hidden");
    $("#playerob_left").find("#player2ob").css("visibility", "hidden");
    $("#playerob_left").find("#player3ob").css("visibility", "hidden");
    $("#playerob_left").find("#player4ob").css("visibility", "hidden");
    $("#playerob_left").find("#player5ob").css("visibility", "hidden");
    if(right == true){
        if(player.observer_slot == 1){
            $("#playerob_left").find("#player1ob").css("visibility", "visible");
        }
        else if(player.observer_slot == 2){
            $("#playerob_left").find("#player2ob").css("visibility", "visible");
        }
        else if(player.observer_slot == 3){
            $("#playerob_left").find("#player3ob").css("visibility", "visible");
        }
        else if(player.observer_slot == 4){
            $("#playerob_left").find("#player4ob").css("visibility", "visible");
        }
        else if(player.observer_slot == 5){
            $("#playerob_left").find("#player5ob").css("visibility", "visible");
        }
    }
    else {
    	if(player.observer_slot == 6){
            $("#playerob_right").find("#player1ob").css("visibility", "visible");
    	}
    	else if(player.observer_slot == 7){
            $("#playerob_right").find("#player2ob").css("visibility", "visible");
    	}
    	else if(player.observer_slot == 8){
            $("#playerob_right").find("#player3ob").css("visibility", "visible");
        }
    	else if(player.observer_slot == 9){
            $("#playerob_right").find("#player4ob").css("visibility", "visible");
    	}
        else if(player.observer_slot == 10){
            $("#playerob_right").find("#player5ob").css("visibility", "visible");
        }
    }
    obplayer = player.observer_slot;
    let flag = player.country_code || (right
        ? (teams.left.flag || "")
        : (teams.right.flag || ""));        

    $("#kills_count").html(statistics.kills);
    $("#assist_count").html(statistics.assists);
    $("#death_count").html(statistics.deaths);

    $("#player-container")
        .removeClass("t ct")
        .addClass(player.team.toLowerCase());

    $("#current_nick").html(player.name);
    if(right == true){
        $("#nick_also").html(teams.left.name);
        $("#current_nick").css("background-image", "url('/teams/" + teams.left.logo + ".png')");
    }
    else {
        $("#nick_also").html(teams.right.name);
        $("#current_nick").css("background-image", "url('/teams/" + teams.right.logo + ".png')");
    }
    

    $("#nades").html("");


    for (let key in weapons) {
        let weapon = weapons[key];
        if (weapon.type == "Grenade") {
            for (let x = 0; x < weapon.ammo_reserve; x++) {
                $("#nades").append($("<img />").attr("src", "/files/img/grenades/" + weapon.name + ".png"));
            }
        }
        if (weapon.state == "active" || weapon.state == "reloading") {
            if (weapon.type == "Grenade" || weapon.type == "C4" || weapon.type == "Knife" || statistics.health == 0) {

                $(".clip").html("");
                $(".reserve").html("");
            } else {
                $(".clip").html(weapon.ammo_clip + "/");
                $(".reserve").html(weapon.ammo_reserve);
            }
        }
    }
    $("#armor-text").html(statistics.armor);
    $("#health-text").html(statistics.health);
    if(statistics.health > 0 && statistics.health <= 20){
    	$("#health-text").css("color","rgba(255,0,0,2)");
    }else {
    	$("#health-text").css("color","rgba(255,255,255,1)");
    }
    $("#armor-text")
        .removeClass("armor helmet")
        .addClass(statistics.helmet
            ? "helmet"
            : "armor");
    loadAvatar(player.steamid, function(){
        $("#avatar_container").html($("<img />").attr("src", "/av/"+player.steamid));
    });
}

function fillPlayers(teams){
    if(teams.left.players){
        for(var i = 0; i < 5; i++){
            if(i >=teams.left.players.length){
                $("#left").find("#player"+(i+1)).css("opacity", "0");
            } else{
                fillPlayer(teams.left.players[i],i, "left", teams.left.players.length);
                $("#left").find("#player"+(i+1)).css("opacity","1");
            }
        }
    }
    if(teams.right.players){
        for(var i = 0; i < 5; i++){
            if(i >=teams.right.players.length){
                $("#right").find("#player"+(i+1)).css("opacity","0");
            } else{
                fillPlayer(teams.right.players[i],i, "right", teams.right.players.length);
                $("#right").find("#player"+(i+1)).css("opacity","1");
            }
        }
    }
}

function fillPlayer(player,nr, side, max){
    let slot = player.observer_slot;
    let statistics = player.getStats();
    let weapons = player.getWeapons();
    let steamid = player.steamid;

    let team = player.team.toLowerCase();

    let health_color = statistics.health <= -1 ? "#ff0000" : team == "ct" ? "#4682b4":"#cd853f";
    let damage_color = "#ff0000";

    let $player = $("#"+side).find("#player"+(nr+1));

    let $playerdeath = $("#playerdeaths_"+side).find("#player"+(nr+1)+"death");

    let $nade_side = $("#"+side).find(".utility");
    let $nade_count = $nade_side.find(".nades_count");

    let playernb = nr + 1;

    let $obplayer = $("#playerob_" + side).find("#player"+(nr+1)+"ob");

    let $bar1 = $player.find(".bar1");
    let $bar2 = $player.find(".bar2");
    let $bar3 = $player.find(".bar3");

    let oldhp = $bar1.find("#hp_p").text();    

    if (oldhp != statistics.health) {
        updateHp($bar1.find(".damage_bar"), side, oldhp, statistics.health, damage_color, playernb)
    }

    let gradient = "linear-gradient(to " + side +", rgba(0,0,0,0) " + (100-statistics.health) + "%, " + health_color + " " + (100-statistics.health) + "%)";

    $("#playerdeaths_left").find("#player1death").css("border", "solid" + health_color + "2px");
    $("#playerdeaths_left").find("#player2death").css("border", "solid" + health_color + "2px");
    $("#playerdeaths_left").find("#player3death").css("border", "solid" + health_color + "2px");
    $("#playerdeaths_left").find("#player4death").css("border", "solid" + health_color + "2px");
    $("#playerdeaths_left").find("#player5death").css("border", "solid" + health_color + "2px");
    $("#playerdeaths_right").find("#player1death").css("border", "solid" + health_color + "2px");
    $("#playerdeaths_right").find("#player2death").css("border", "solid" + health_color + "2px");
    $("#playerdeaths_right").find("#player3death").css("border", "solid" + health_color + "2px");
    $("#playerdeaths_right").find("#player4death").css("border", "solid" + health_color + "2px");
    $("#playerdeaths_right").find("#player5death").css("border", "solid" + health_color + "2px");

    $bar1.find("#bar_username").text(player.name.split(" ").join(""));
    $bar1.find("#bar_username").removeClass("dead").addClass(statistics.health == 0 ? "dead" : "");

    $bar1.find("#hp_p").text(statistics.health);
    $bar1.find(".hp_bar").css("background", gradient);

    $bar3.find(".kills").text(statistics.kills);
    $bar3.find(".assists").text(statistics.assists);
    $bar3.find(".deaths").text(statistics.deaths);

    $bar1.find(".armors").html(statistics.helmet ? $("<img />").attr("src", "/files/img/helmet.png") : statistics.armor > 0 ? $("<img />").attr("src", "/files/img/armor.png") : "");
    $bar2.find(".bomb_defuse").html(statistics.defusekit ? $("<img />").attr("src", "/files/img/elements/defuse.png").addClass("invert_brightness") : "");0

    $bar2.find(".moneys").text("$"+statistics.money);
    $bar2.find(".moneys").removeClass("low").addClass(statistics.money < 1000? "low":"");
    
    $bar2.find("#weapon_icon").html("");
    $bar3.find("#subweapon_icon").html("");

    if(side == "left"){
        if(playernb == 1){
            if(statistics.health <= 0){
                if(player1death == false){
                    player1death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }
            }else {
                player1death = false;
                $playerdeath.css("visibility","hidden");
            }
            player1hp = statistics.health;
        }
        else if(playernb == 2){
            if(statistics.health <= 0){
                if(player2death == false){
                    player2death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }
            }else {
                player2death = false;
                $playerdeath.css("visibility","hidden");
            }
            player2hp = statistics.health;
        }
        else if(playernb == 3){
            if(statistics.health <= 0){
                if(player3death == false){
                    player3death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }
            }else {
                player3death = false;
                $playerdeath.css("visibility","hidden");
            }
            player3hp = statistics.health;
        }
        else if(playernb == 4){
            if(statistics.health <= 0){
                if(player4death == false){
                    player4death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }
            }else {
                player4death = false;
                $playerdeath.css("visibility","hidden");
            }
            player4hp = statistics.health;
        }
        else if(playernb == 5){
            if(statistics.health <= 0){
                if(player5death == false){
                    player5death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }
            }else {
                player5death = false;
                $playerdeath.css("visibility","hidden");
            }
            player5hp = statistics.health;
        }
    }
    else if(side == "right"){
        if(playernb == 1){
            if(statistics.health <= 0){
                if(player6death == false){
                    player6death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }
            }else {
                player6death = false;
                $playerdeath.css("visibility","hidden");
            }
            player6hp = statistics.health;
        }
        else if(playernb == 2){
            if(statistics.health <= 0){
                if(player7death == false){
                    player7death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }
            }else {
                player7death = false;
                $playerdeath.css("visibility","hidden");
            }
            player7hp = statistics.health;
        }
        else if(playernb == 3){
            if(player8death == false){
                if(statistics.health <= 0){
                    player8death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }else {
                    player8death = false;
                    $playerdeath.css("visibility","hidden");
                }
            }
            player8hp = statistics.health;
        }
        else if(playernb == 4){
            if(statistics.health <= 0){
                if(player9death == false){
                    player9death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }
            }else {
                player9death = false;
                $playerdeath.css("visibility","hidden");
            }
            player9hp = statistics.health;
        }
        else if(playernb == 5){
            if(statistics.health <= 0){
                if(player10death == false){
                    player10death = true;
                    deathPlayer(playernb, side, $player, $obplayer)
                    $playerdeath.css("background",health_color);
                    $playerdeath.css("visibility","visible");
                }
            }else {
                player10death = false;
                $playerdeath.css("visibility","hidden");
            }
            player10hp = statistics.health;
        }
    }

    if(statistics.health <= 0){
        $bar1.find(".damage_bar").css("display","none");
        $bar1.find("#hp_p").hide();
        $bar1.find("#armors").hide();
        $bar2.find("#weapon_icon").hide();
        $bar2.find("#bomb_defuse").hide();
        $bar3.find("#subweapon_icon").hide();
    }else {
        $bar1.find(".damage_bar").css("display","block");
        $bar1.find("#hp_p").show();
        $bar1.find("#armors").show();
        $bar2.find("#weapon_icon").show();
        $bar2.find("#bomb_defuse").show();
        $bar3.find("#subweapon_icon").show();
    }

    if(statistics.round_kills > 0){
        $bar3.find(".roundkill_count").text(statistics.round_kills).css("visibility","visible");
        $bar3.find(".roundkill_icon").css("visibility","visible");
    }
    else {
        $bar3.find(".roundkill_count").css("visibility","hidden");
        $bar3.find(".roundkill_icon").css("visibility","hidden");
    }

    for(let key in weapons){
        let weapon = weapons[key];
        let name = weapon.name.replace("weapon_", "");
        let state = weapon.state;
        let view = "";
        let type = weapon.type;

        if(type != "C4" && type != "Knife"){
            view += weapon.state == "active" ? "checked" : "";
            if(type == "Grenade"){
                for(let x = 0; x < weapon.ammo_reserve; x++){
                    $bar3.find("#subweapon_icon").append($("<img />").attr("src", "/files/img/grenades/weapon_" + name + ".png").addClass("invert").addClass(view));
        		if(side == "left"){
          		if(name == "hegrenade"){
        	  		left_he_grenades++;
      	  		}
          		else if(name == "flashbang"){
        	  		left_flash_grenades++;
          		}
          		else if(name == "smokegrenade"){
        	  		left_smoke_grenades++;
          		}
          		else if(name == "incgrenade" || name == "molotov"){
        	  		left_fire_grenades++;
          		}
          		else if(name == "decoy"){
        	  		left_decoy_grenades++;
          		}
        	}
        	else if(side == "right"){
          		if(name == "hegrenade"){
        	  		right_he_grenades++;
      	  		}
          		else if(name == "flashbang"){
        	  		right_flash_grenades++;
          		}
          		else if(name == "smokegrenade"){
        	  		right_smoke_grenades++;
          		}
          		else if(name == "incgrenade" || name == "molotov"){
        	  		right_fire_grenades++;
          		}
          		else if(name == "decoy"){
        	  		right_decoy_grenades++;
          		}          
        	}
        }
            } else if(type) {
                view += side == "right" ? " img-hor" : "";
                if (type == "Pistol") {
                    $bar3.find("#subweapon_icon").prepend($("<img />").attr("src", "/files/img/weapons/" + name + ".png").addClass("invert").addClass(view));
                } else {
                    $bar2.find("#weapon_icon").prepend($("<img />").attr("src", "/files/img/weapons/" + name + ".png").addClass("invert").addClass(view));
                }
            }
        }
        if(type == "C4"){
            $bar2.find(".bomb_defuse").html($("<img />").attr("src", "/files/img/elements/bomb.png").addClass("invert_brightness"));
        }
    }
    if(side == "left"){
        $nade_count.find(".he_count").html(left_he_grenades);
    	$nade_count.find(".flash_count").html(left_flash_grenades);
    	$nade_count.find(".smoke_count").html(left_smoke_grenades);
    	$nade_count.find(".fire_count").html(left_fire_grenades);
    }
    else if(side == "right"){
    	$nade_count.find(".he_count").html(right_he_grenades);
    	$nade_count.find(".flash_count").html(right_flash_grenades);
    	$nade_count.find(".smoke_count").html(right_smoke_grenades);
    	$nade_count.find(".fire_count").html(right_fire_grenades);
    }    
    if (!start_money[steamid]) {
        start_money[steamid] = statistics.money;
    }

    $("#stats_player"+slot).find("#stat_money").html("-"+(start_money[steamid]-statistics.money)+"$");
}

var isDefusing = false;

var bomb_time,
    bomb_timer,
    bomb_timer_css;
bomb_time = 0;
function bomb(time) {
    if (Math.pow((time - bomb_time), 2) > 1) {
        clearInterval(bomb_timer);
        bomb_time = parseFloat(time);
        $("#bomb_time").find(".bomb_vac").css("display", "block")
        if (bomb_time > 0) {
            bomb_timer = setInterval(function () {
                bomb_timer_css = {
                    display: "block",
                    background: "linear-gradient(rgba(0,0,0,0) " + bomb_time * 100 / 40 + "%, #ff0000 " + bomb_time * 100 / 40 + "%)"
                }
                $("#bomb_timer").css(bomb_timer_css);
                bomb_time = bomb_time - 0.01;
            }, 10);
        } else {
            clearInterval(bomb_timer);
        }
    }
}

function resetBomb() {
    clearInterval(bomb_timer);
    $("#bomb_timer").css("display", "none");
}

function updateHp(el, side, oldhp, hp, color, nr) {
    let damage_level = 100 - hp;
    if(side == "left"){
        setTimeout (function () {
            if(nr == 1){
            	if(hp != player1hp){
                	hp = player1hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
                		'width': hp + '%'
           			},400);
            	}    		
            }
            else if(nr == 2){
            	if(hp != player2hp){
                	hp = player2hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
                		'width': hp + '%'
           			},400);
            	}    
            }
            else if(nr == 3){    
            	if(hp != player3hp){
                	hp = player3hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
                		'width': hp + '%'
           			},400);
            	}    
            }
            else if(nr == 4){
            	if(hp != player4hp){
                	hp = player4hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
                		'width': hp + '%'
           			},400);
            	}    
            }
            else if (nr == 5){
            	if(hp != player5hp){
                	hp = player5hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
                		'width': hp + '%'
           			},400);
            	}
            }
        },1000)
    }
    else if(side == "right"){
        setTimeout (function () {
            if(nr == 1){
            	if(hp != player6hp){
                	hp = player6hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
               			'margin-left': damage_level+'%',
                		'width': hp + '%'
           			},400);
            	}
            }
            else if(nr == 2){
            	if(hp != player7hp){
                	hp = player7hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
               			'margin-left': damage_level+'%',
                		'width': hp + '%'
           			},400);
            	}
            }
            else if(nr == 3){
            	if(hp != player8hp){
                	hp = player8hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
               			'margin-left': damage_level+'%',
                		'width': hp + '%'
           			},400);
            	}
            }
            else if(nr == 4){
            	if(hp != player9hp){
                	hp = player9hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
               			'margin-left': damage_level+'%',
                		'width': hp + '%'
           			},400);
            	}
            }
            else if (nr == 5){
            	if(hp != player10hp){
                	hp = player10hp;
                	updateHp(el, side, oldhp, hp, color, nr)
            	}else {
            		el.animate({
               			'margin-left': damage_level+'%',
                		'width': hp + '%'
           			},400);
            	};
            }
        },1000)
    }
}

function deathPlayer(nr, side, playerber, obplayer){
    let $deathbar = $("#playerdeaths_"+side).find("#player"+nr+"death");
    setTimeout (function () {
        playerber.animate({width: 170},150);
        obplayer.animate({width: 170},150);
    },400)
    if(side == "left"){      
        $deathbar.animate({ 'margin-left': '0px'},350);
        setTimeout(function(){
        	$deathbar.animate({ 'margin-left': '-335px'},350);
        },400)
    }else if(side == "right"){
        $deathbar.animate({ 'margin-left': '0px'},350);
        setTimeout(function(){
        	$deathbar.animate({ 'margin-left': '335px'},350);
        },400)
    }
}

//SOME other weird vars
var menu = false;
var freezetime = false;
let last_round = 0;

function updatePage(data) {
    left_he_grenades = 0;
	left_flash_grenades = 0;
	left_smoke_grenades = 0;
	left_fire_grenades = 0;
	left_decoy_grenades = 0;
	right_he_grenades = 0;
	right_flash_grenades = 0;
	right_smoke_grenades = 0;
	right_fire_grenades = 0;
	right_decoy_grenades = 0;
	var start_money = {};
    var observed = data.getObserved();
    var phase = data.phase();
    var team_one = data.getTeamOne();
    var team_two = data.getTeamTwo();
    
    var matchup = data.getMatchType();
    var match = data.getMatch();

    if(matchup && matchup.toLowerCase() != "none"){
        var block = $("<div class='block'></div>");
        var left_bl = $("<div></div>");
        var right_bl = $("<div></div>");
        for(var x = 0; x < (matchup == "bo5" ? 3 : 2); x ++){
            block.clone().appendTo($(left_bl)).addClass(match.team_1.map_score > x ? "win" : "");
            block.clone().appendTo(right_bl).addClass(match.team_2.map_score > x ? "win" : "");
        }
        $("#match_one_info").html(left_bl);
        $("#match_two_info").html(right_bl);
        
        $("#match_tournament").show();
        $("#match_info").css("visibility","visible");
        $("#match_info").text("Best Of " + matchup.substr(2));
    } else {
        $("#match_tournament").hide();
        $("#match_info").css("visibility","hidden");
    }

    if (observed.steamid == 1 || !observed) {
        $("#player-container").css("opacity", "0");
    } else if (observed) {
        menu = (data.info.player.activity == "menu");
        $("#player-container").css("opacity", !menu ? "1" : "0");
    }
    let left,
        right;
    var players = data.getPlayers();
    var round = data.round();
    var map = data.map();

    var round_now = map.round + (round.phase == "over" || round.phase == "intermission"
        ? 0
        : 1);
    if ((round.phase == "freezetime" && !freezetime) || round_now != last_round) {
        start_money = {};
    }

    var longd = 10;
    var team_ct = data.getCT();
    var team_t = data.getT();
    var test_player2 = data.getPlayer(1);
    var tscore = [];
    var timeouts_t = 4 - team_t.timeouts_remaining;
    var timeouts_ct = 4 - team_ct.timeouts_remaining;
    $("body").css("display", !map || menu
        ? "none"
        : "block");
    if (test_player2) {
        left = test_player2
            .team
            .toLowerCase() == "ct"
            ? team_ct
            : team_t;
        right = test_player2
            .team
            .toLowerCase() != "ct"
            ? team_ct
            : team_t;
        
        teams.left.side = left.side || null;
        teams.right.side = right.side || null;

        teams.left.name = team_one.team_name || left.name;
        teams.right.name = team_two.team_name || right.name;

        if(teams.left.score !== undefined && teams.right.score !== undefined){
            if(left.score > teams.left.score){
                $("#winning_team").text(teams.left.name).removeClass("t-color ct-color").addClass(teams.left.side.toLowerCase() + "-color");
                $("#win_ms").addClass(teams.left.side.toLowerCase() + "-color");
                $("#win_team_logo_left").attr("src", "/teams/"+teams.left.logo);
                $("#win_tteam_logo_right").attr("src", "/teams/"+teams.left.logo);
                $("#who_won").fadeTo(1000, 1).delay(2000).fadeTo(1000, 0);
            } else if(right.score > teams.right.score){
                $("#winning_team").text(teams.right.name).removeClass("t-color ct-color").addClass(teams.right.side.toLowerCase() + "-color");
                $("#win_ms").addClass(teams.right.side.toLowerCase() + "-color");
                $("#win_team_logo_left").attr("src", "/teams/"+teams.right.logo);
                $("#win_tteam_logo_right").attr("src", "/teams/"+teams.right.logo);
                $("#who_won").fadeTo(1000, 1).delay(2000).fadeTo(1000, 0);
            }
        }

        if(test_player2.team.toLowerCase() == "ct"){
            $("#left").find(".utility").find(".nades_count").find(".fires").find("img").attr("src","/files/img/grenades/weapon_incgrenade.png");
            $("#right").find(".utility").find(".nades_count").find(".fires").find("img").attr("src","/files/img/grenades/weapon_molotov.png");
            $("#left").find(".utility").find(".utility_bar").css("background","linear-gradient(to right, rgba(97, 183, 255, 0.65) 195px, rgba(97, 183, 255, 0.65) 195px, rgba(97, 183, 255, 0.3) 310px, rgba(97, 183, 255, 0.0) 310px)");
            $("#right").find(".utility").find(".utility_bar").css("background","linear-gradient(to left, rgba(255, 165, 77, 0.65) 195px, rgba(255, 165, 77, 0.65) 195px, rgba(255, 165, 77, 0.3) 310px, rgba(255, 165, 77, 0.0) 310px)");
        }
        else {
            $("#right").find(".utility").find(".nades_count").find(".fires").find("img").attr("src","/files/img/grenades/weapon_incgrenade.png");
            $("#left").find(".utility").find(".nades_count").find(".fires").find("img").attr("src","/files/img/grenades/weapon_molotov.png");
            $("#left").find(".utility").find(".utility_bar").css("background","linear-gradient(to left, rgba(255, 165, 77, 0.65) 195px, rgba(255, 165, 77, 0.65) 195px, rgba(255, 165, 77, 0.3) 310px, rgba(255, 165, 77, 0.0) 310px)");
            $("#right").find(".utility").find(".utility_bar").css("background","linear-gradient(to right, rgba(97, 183, 255, 0.65) 195px, rgba(97, 183, 255, 0.65) 195px, rgba(97, 183, 255, 0.3) 310px, rgba(97, 183, 255, 0.0) 310px)");
        }

        teams.left.score = left.score;
        teams.right.score = right.score;

        teams.left.flag = team_one.country_code || null;
        teams.right.flag = team_two.country_code || null;

        teams.left.logo = team_one.logo || null;
        teams.right.logo = team_two.logo || null;

        teams.left.map_score = team_one.map_score || 0;
        teams.right.map_score = team_two.map_score || 0;


        teams.left.players = left.players || null;
        teams.right.players = right.players || null;

        $("#match_one_info")
            .removeClass("ct t")
            .addClass(test_player2.team.toLowerCase());
        $("#match_two_info")
            .removeClass("ct t")
            .addClass(test_player2.team.toLowerCase() != "ct"
                ? "ct"
                : "t");

        $("#team_1")
            .removeClass("ct-color t-color")
            .addClass(test_player2.team.toLowerCase() + "-color");
        $("#team_2")
            .removeClass("ct-color t-color")
            .addClass(test_player2.team.toLowerCase() != "t"
                ? "t-color"
                : "ct-color");

        $("#left")
            .find("#team_money_1").removeClass('low').addClass(left.team_money < 1000 ? "low":"")
            .text("$" + left.team_money);
        $("#left")
            .find("#eq_money_1")
            .text("$" + left.equip_value);

        $("#right")
            .find("#team_money_2").removeClass('low').addClass(right.team_money < 1000 ? "low":"")
            .text("$" + right.team_money);
        $("#right")
            .find("#eq_money_2")
            .text("$" + right.equip_value);
    }
    if(round_now <31){
    	$("#round_counter").html("Round " + round_now + " / 30");
    }
    else {
    	$("#round_counter").html("OverRound " + round_now);
    }
    
    //TEAMS

    $("#team_2 #team_name").html(teams.right.name);
    $("#team_2 #team_score").html(teams.right.score);
    $("#team_1 #team_name").html(teams.left.name);
    $("#team_1 #team_score").html(teams.left.score);
    if (teams.left.logo || teams.left.flag) {
        if (teams.left.flag) {
            $("#team_1 #team_logo #team_flag").css("background-image", "url('/files/img/flags/" + teams.left.flag + ".png')");
        }
        if (teams.left.logo) {
            $("#team_1_logo").attr("src", "/teams/"+teams.left.logo);
            $("#team_1 #team_logo").removeClass("empty");
        }
    } else {
        $("#team_1 #team_logo #team_flag").css("background-image", "");
        $("#team_1 #team_logo").addClass("empty");
    }
    if (teams.right.logo || teams.right.flag) {
        if (teams.right.flag) {
            $("#team_2 #team_logo #team_flag").css("background-image", "url('/files/img/flags/" + teams.right.flag + ".png')");
        }
        if (teams.right.logo) {
            $("#team_2_logo").attr("src", "/teams/"+teams.right.logo);
            $("#team_2 #team_logo").removeClass("empty");
        }
    } else {
        $("#team_2 #team_logo").addClass("empty");
        $("#team_2 #team_logo #team_flag").css("background-image", "");
    }

    //OBSERVED PLAYER
    if (observed && observed.steamid != 1 && observed.getStats()) {
        fillObserved(observed);
    }



    //EVERY OTHER PLAYER
    if (players) {
        
        var offset = 0;
        for (var sl in players) {
            let player = players[sl];
            if (avatars[player.steamid] != true && disp_avatars) 
                loadAvatar(player.steamid);
            
            if(player.observer_slot <= 5 && offset == 0 && player.team.toLowerCase() != teams.left.side)
                offset = 6 - sl;
        }
        fillPlayers(teams)
    } 



    //PHASESc
    if (phase) {
        $("#time_counter").css("color", (phase.phase == "live" || phase.phase == "over" || phase.phase == "warmup" || (phase.phase == "freezetime" && phase.phase_ends_in > 10))
            ? "white"
            : "red");
        $("#defuser").css("display", phase.phase == "defuse"
            ? "block"
            : "none");

        if (phase.phase == "bomb" || phase.phase == "defuse") {
            if (phase.phase == "bomb") {
                bomb(parseFloat(phase.phase_ends_in));
            }
            if (phase.phase == "defuse") {
                if (!isDefusing) {
                    longd = 5;
                    if (parseFloat(phase.phase_ends_in) > 5) {
                        longd = 10;
                    }
                    isDefusing = true;
                }
                var seconds = Math.round(parseFloat(phase.phase_ends_in).toFixed(1));
                $("#defuse_bar").css("height", 140 * (parseFloat(phase.phase_ends_in) / longd) + "px");
                $("#defuse_time").text("00:" + (seconds < 10 ? "0" + seconds : seconds));
            }
        } else {
            resetBomb();
        }

        if(phase.phase == "timeout_t"){
            if (phase.phase_ends_in < 0.3) {
                if(test_player2.team.toLowerCase() != "ct"){
                    $("#left_timeout").animate({'marginTop': '-55px'},350);
                    setTimeout(function(){
                    	$("#left_timeout").css("visibility","hidden");
            			$("#left_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","hidden");
            			$("#left_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","hidden");
                    },350);
                }
                else{
                    $("#right_timeout").animate({'marginTop': '-55px'},350);
                    setTimeout(function(){
                    	$("#right_timeout").css("visibility","hidden");
            			$("#right_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","hidden");
            			$("#right_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","hidden");
                    },350);
                }
                setTimeout(function () {
                    timeout_set = false;
                },350);
            }
        }

        if(phase.phase == "timeout_ct"){
            if (phase.phase_ends_in < 0.3) {
                if(test_player2.team.toLowerCase() == "ct"){
                    $("#left_timeout").animate({'marginTop': '-55px'},350);
                    setTimeout(function(){
                    	$("#left_timeout").css("visibility","hidden");
            			$("#left_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","hidden");
            			$("#left_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","hidden");
                    },350);
                }
                else {
                    $("#right_timeout").animate({'marginTop': '-55px'},350);
                    setTimeout(function(){
                    	$("#right_timeout").css("visibility","hidden");
            			$("#right_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","hidden");
            			$("#right_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","hidden");
                    },350);
                }
                setTimeout(function () {
                    timeout_set = false;
                },350);
            }
        }

        if(phase.phase == "timeout_t"){
            $("#left_timeout").css("visibility","hidden");
            $("#right_timeout").css("visibility","hidden");  
            if(test_player2.team.toLowerCase() != "ct"){
                $("#left_timeout").find(".timeout_ms").find(".timeout_count").text(timeouts_t);
                $("#left_timeout").css("visibility","visible");
            	$("#left_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","visible");
            	$("#left_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","visible");
                if(timeout_set == false){
                    timeout_set = true;
                    setTimeout(function () {
                        $("#left_timeout").css("background","rgba(255, 160, 0,0.7)").animate({'marginTop': '-3px'},350);
                    },200);
                }
            }
            else{
                $("#right_timeout").find(".timeout_ms").find(".timeout_count").text(timeouts_t);
                $("#right_timeout").css("visibility","visible");
            	$("#right_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","visible");
            	$("#right_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","visible");
                if(timeout_set == false){
                    timeout_set = true;
                    setTimeout(function () {
                        $("#right_timeout").css("background","rgba(255, 160, 0,0.7)").animate({'marginTop': '-3px'},350);
                    },200);
                }
            }            
        }

        if(phase.phase == "timeout_ct"){
            $("#left_timeout").css("visibility","hidden");
            $("#right_timeout").css("visibility","hidden");
            if(test_player2.team.toLowerCase() == "ct"){
                $("#left_timeout").find(".timeout_ms").find(".timeout_count").text(timeouts_ct);
                $("#left_timeout").css("visibility","visible");
            	$("#left_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","visible");
            	$("#left_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","visible");
                if(timeout_set == false){
                    timeout_set = true;
                    setTimeout(function () {
                        $("#left_timeout").css("background","rgba(0, 160, 255,0.7)").animate({'marginTop': '-3px'},350);
                    },200);
                }                
            }
            else {
                $("#right_timeout").find(".timeout_ms").find(".timeout_count").text(timeouts_ct);
                $("#right_timeout").css("visibility","visible");
            	$("#right_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","visible");
            	$("#right_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","visible");
                if(timeout_set == false){
                    timeout_set = true;
                    setTimeout(function () {
                        $("#right_timeout").css("background","rgba(0, 160, 255,0.7)").animate({'marginTop': '-3px'},350);
                    },200);
                }
            }
        }

        if(phase.phase == "freezetime"){
            $("#left").find("#player1").find(".bar1").find(".damage_bar").css("margin-left","0%");
            $("#left").find("#player2").find(".bar1").find(".damage_bar").css("margin-left","0%");
            $("#left").find("#player3").find(".bar1").find(".damage_bar").css("margin-left","0%");
            $("#left").find("#player4").find(".bar1").find(".damage_bar").css("margin-left","0%");
            $("#left").find("#player5").find(".bar1").find(".damage_bar").css("margin-left","0%");
            $("#right").find("#player1").find(".bar1").find(".damage_bar").css("margin-left","0%");
            $("#right").find("#player2").find(".bar1").find(".damage_bar").css("margin-left","0%");
            $("#right").find("#player3").find(".bar1").find(".damage_bar").css("margin-left","0%");
            $("#right").find("#player4").find(".bar1").find(".damage_bar").css("margin-left","0%");
            $("#right").find("#player5").find(".bar1").find(".damage_bar").css("margin-left","0%");


            $("#left").find("#player1").find(".bar1").find(".damage_bar").css("display","block");
            $("#left").find("#player2").find(".bar1").find(".damage_bar").css("display","block");
            $("#left").find("#player3").find(".bar1").find(".damage_bar").css("display","block");
            $("#left").find("#player4").find(".bar1").find(".damage_bar").css("display","block");
            $("#left").find("#player5").find(".bar1").find(".damage_bar").css("display","block");
            $("#right").find("#player1").find(".bar1").find(".damage_bar").css("display","block");
            $("#right").find("#player2").find(".bar1").find(".damage_bar").css("display","block");
            $("#right").find("#player3").find(".bar1").find(".damage_bar").css("display","block");
            $("#right").find("#player4").find(".bar1").find(".damage_bar").css("display","block");
            $("#right").find("#player5").find(".bar1").find(".damage_bar").css("display","block");
        }

        if(phase.phase == "paused"){
            if(freezetime == false){
                $("#left").find("#player1").animate({'width': '300px'},500);
                $("#left").find("#player2").animate({'width': '300px'},500);
                $("#left").find("#player3").animate({'width': '300px'},500);
                $("#left").find("#player4").animate({'width': '300px'},500);
                $("#left").find("#player5").animate({'width': '300px'},500);
                $("#right").find("#player1").animate({'width': '300px'},500);
                $("#right").find("#player2").animate({'width': '300px'},500);
                $("#right").find("#player3").animate({'width': '300px'},500);
                $("#right").find("#player4").animate({'width': '300px'},500);
                $("#right").find("#player5").animate({'width': '300px'},500);
                $("#playerob_right").find("#player1ob").animate({width: 296},500);
                $("#playerob_right").find("#player2ob").animate({width: 296},500);
                $("#playerob_right").find("#player3ob").animate({width: 296},500);
                $("#playerob_right").find("#player4ob").animate({width: 296},500);
                $("#playerob_right").find("#player5ob").animate({width: 296},500);
                $("#playerob_left").find("#player1ob").animate({width: 296},500);
                $("#playerob_left").find("#player2ob").animate({width: 296},500);
                $("#playerob_left").find("#player3ob").animate({width: 296},500);
                $("#playerob_left").find("#player4ob").animate({width: 296},500);
                $("#playerob_left").find("#player5ob").animate({width: 296},500);
                freezetime = true;
                player1death = false;
                player2death = false;
                player3death = false;
                player4death = false;
                player5death = false;
                player6death = false;
                player7death = false;
                player8death = false;
                player9death = false;
                player10death = false;
            }
            if ($(".money").css("opacity") == 0) {
                $(".money").fadeTo(1000, 1);
                $(".utility").fadeTo(1000,1);
                $(".utility").fadeTo(1000, 1);
            }
            $("#left_timeout").css("visibility","visible");
            $("#right_timeout").css("visibility","visible");
            $("#left_timeout").find(".timeout_ms").find(".timeout_count").css("display","none");
            $("#right_timeout").find(".timeout_ms").find(".timeout_count").css("display","none");
            $("#left_timeout").find(".timeout_ms").find(".timeout_max").css("display","none");
            $("#right_timeout").find(".timeout_ms").find(".timeout_max").css("display","none");
            $("#left_timeout").find(".timeout_ms").find(".timeout_team").text("MATCH");
            $("#right_timeout").find(".timeout_ms").find(".timeout_team").text("PAUSE");
            $("#left_timeout").find(".timeout_ms").find(".timeout_team").css("margin-left","50px");
            $("#right_timeout").find(".timeout_ms").find(".timeout_team").css("margin-left","50px");
            if(pause_set == false){
                pause_set = true;
                setTimeout(function () {
                    $("#right_timeout").css("background","rgba(255 , 0, 0,0.7)").animate({'marginTop': '-3px'},350);
                    $("#left_timeout").css("background","rgba(255, 0, 0,0.7)").animate({'marginTop': '-3px'},350);
                },200);
            }
        }else {
            if(pause_set == true){
                pause_set = false;
                setTimeout(function () {
                    $("#left_timeout").animate({'marginTop': '-55px'},350);
                    $("#right_timeout").animate({'marginTop': '-55px'},350);
                },200);
                setTimeout (function () {
                    $("#left_timeout").css("visibility","hidden");
                    $("#right_timeout").css("visibility","hidden");
                    $("#left_timeout").find(".timeout_ms").find(".timeout_count").css("display","block");
                    $("#right_timeout").find(".timeout_ms").find(".timeout_count").css("display","block");
                    $("#left_timeout").find(".timeout_ms").find(".timeout_max").css("display","block");
                    $("#right_timeout").find(".timeout_ms").find(".timeout_max").css("display","block");
                    $("#left_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","hidden");
                    $("#right_timeout").find(".timeout_ms").find(".timeout_count").css("visibility","hidden");
                    $("#left_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","hidden");
                    $("#right_timeout").find(".timeout_ms").find(".timeout_max").css("visibility","hidden");
                    $("#left_timeout").find(".timeout_ms").find(".timeout_team").text("TIMEOUT");
                    $("#right_timeout").find(".timeout_ms").find(".timeout_team").text("TIMEOUT");
            		$("#left_timeout").find(".timeout_ms").find(".timeout_team").css("margin-left","125px");
            		$("#right_timeout").find(".timeout_ms").find(".timeout_team").css("margin-left","125px");
                },500);
            }
        }

        if (phase.phase == "freezetime" || phase.phase.substring(0,7) == "timeout") {
            if (phase.phase_ends_in > 0) {
                if ($(".money").css("opacity") == 0) {
                    $(".money").fadeTo(1000, 1);
                    $(".utility").fadeTo(1000,1);
                    $(".utility").fadeTo(1000, 1);
                }
                if(freezetime == false){
                    $("#left").find("#player1").animate({'width': '300px'},500);
                    $("#left").find("#player2").animate({'width': '300px'},500);
                    $("#left").find("#player3").animate({'width': '300px'},500);
                    $("#left").find("#player4").animate({'width': '300px'},500);
                    $("#left").find("#player5").animate({'width': '300px'},500);
                    $("#right").find("#player1").animate({'width': '300px'},500);
                    $("#right").find("#player2").animate({'width': '300px'},500);
                    $("#right").find("#player3").animate({'width': '300px'},500);
                    $("#right").find("#player4").animate({'width': '300px'},500);
                    $("#right").find("#player5").animate({'width': '300px'},500);
                    $("#playerob_right").find("#player1ob").animate({width: 296},500);
                    $("#playerob_right").find("#player2ob").animate({width: 296},500);
                    $("#playerob_right").find("#player3ob").animate({width: 296},500);
                    $("#playerob_right").find("#player4ob").animate({width: 296},500);
                    $("#playerob_right").find("#player5ob").animate({width: 296},500);
                    $("#playerob_left").find("#player1ob").animate({width: 296},500);
                    $("#playerob_left").find("#player2ob").animate({width: 296},500);
                    $("#playerob_left").find("#player3ob").animate({width: 296},500);
                    $("#playerob_left").find("#player4ob").animate({width: 296},500);
                    $("#playerob_left").find("#player5ob").animate({width: 296},500);
                    freezetime = true;
                    player1death = false;
                    player2death = false;
                    player3death = false;
                    player4death = false;
                    player5death = false;
                    player6death = false;
                    player7death = false;
                    player8death = false;
                    player9death = false;
                    player10death = false;
                }
            } else {
                freezetime = false;
                if ($(".money").css("opacity") == 1) {
                    $(".money").fadeTo(1000, 0);
                    $(".utility").fadeTo(1000,0);
                    $(".utility").fadeTo(1000, 0);
                    if (observed && observed.steamid != 1) 
                        $("#player-container").fadeTo(1000, 1);

                    }
                }
        } else {
            if(pause_set == false){
                if ($(".money").css("opacity") == 1) {
                    $(".money").fadeTo(1000, 0);
                    $(".utility").fadeTo(1000,0);
                    $(".utility").fadeTo(1000, 0);
                    if (observed && observed.steamid != 1) 
                        $("#player-container").fadeTo(1000, 1);
                }
            }
        }
        if (phase.phase_ends_in) {
            var countdown = Math.abs(Math.ceil(phase.phase_ends_in));
            var count_minute = Math.floor(countdown / 60);
            var count_seconds = countdown - (count_minute * 60);
            if (count_seconds < 10) {
                count_seconds = "0" + count_seconds;
            }
            if(phase.phase == "bomb" || phase.phase == "defuse"){
                $("#time_counter").text("").addClass("bomb_timer");
            } else {
                $("#time_counter").text(count_minute + ":" + count_seconds).removeClass("bomb_timer");
            }
        }
    } 
    freezetime = round.phase == "freezetime";
    last_round = round_now;
}

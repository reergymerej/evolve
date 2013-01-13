var dudes = [];
var mutationRate = .25;
var dudesInHistory = 10;
var speed = 500;
var paused = false;

var DudeView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		var template = _.template( $('#dude_template').html() );

		var face = Math.floor(this.options.mood * 4),
			faceWidthRatio = this.options.width / 30;

		this.$el
			.html(template)
			.find('.skin')
			.css('background-color', this.options.skinColor)
			.css('width', this.options.width)
			.css('height', this.options.height)
			.css('background-position', (30 * faceWidthRatio * -face) + 'px 0px')
			.css('background-size', (150 * faceWidthRatio) + 'px 100%')

		this.$el.find('.body').css({
			width: this.options.width,
			height: this.options.height / 30 * 98
		});
	}
});


function Dude(opt){
	var r = opt.r,
		g = opt.g,
		b = opt.b,
		height = opt.height,
		width = opt.width,
		mood = opt.mood,
		that = this,
		element,
		view;

	this.r = r;
	this.g = g;
	this.b = b;
	this.height = height;
	this.width = width;
	this.mood = mood;

	element = $('<div>')
			.addClass('dude')
			.data('dude', that)
			.click(function(){
				console.log(that);
				$(this).toggleClass('active');
				
				if($(this).hasClass('active')){
					select();
				};
			});
	
	$('#dudes').append( element );

	view = new DudeView({
		el: element,
		width: width,
		height: height,
		skinColor: getSkinColor,
		mood: mood
	});

	function getSkinColor(){
		return 'rgb(' + getColor(r) + ', ' + getColor(g) + ', ' + getColor(b) + ')';
		function getColor(x){
			return Math.floor(x * 255);
		};
	};
};


/**
* @return Dude
**/
function combine(dudeA, dudeB){
	var props = {},
		dudeAProp,
		dudeBProp;

	for(var x in dudeA){
		if(dudeA.hasOwnProperty(x)){
			
			dudeAProp = dudeA[x];
			dudeBProp = dudeB[x];

			props[x] = (dudeAProp + dudeBProp) / 2;

			//	mutate
			props[x] += rand(-mutationRate, mutationRate) * props[x]; 
			// props[x] += (Math.random() < .5 ? -1 : 1) * mutationRate * props[x]; 
		};
	};

	return new Dude(props);
};

function select(){
	var selected = $('.active');

	if(selected.length === 2){
		combine(selected.first().data('dude'), selected.last().data('dude'));

		selected.first().removeClass('active');
		
		if($('.dude').length > dudesInHistory){
			$('.dude').first().remove();
		};
	};
};

function rand(min, max){
	return Math.random() * (max - min) + min;
};

function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function breed(){

	if(!paused) {
		//mutation
		mutationRate = parseInt($('#mutation').val(), 10) * .01;	
		dudes.push( combine( dudes[dudes.length - 1], dudes[dudes.length - 2] ) );

		while($('.dude').length > parseInt($('#generations').val(), 10)){
			$('.dude').first().remove();
		};
	};

	setTimeout(breed, getSpeed());
};

function getSpeed(){
	return parseInt($('#speed').val() * 100, 10);
};

$(function(){
	var descendants = 50;
	var adam = new Dude({
			r: .5,
			g: .5,
			b: .5,
			height: 30,
			width: 30,
			mood:.5
		});
	var eve = new Dude({
			r: .5,
			g: .5,
			b: .5,
			height: 30,
			width: 30,
			mood:.5
		});
	
	// dudes.push( combine(adam, eve) );
	// dudes.push( combine(adam, eve) );

	dudes.push(adam, eve);

	setTimeout(breed, getSpeed);

	$('a').click(function(){
		paused = !paused;
	});
});
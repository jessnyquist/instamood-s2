var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
  var ACCESS_TOKEN = "177538508.7e5ca69.db9e056c9ef94ababbaa04435a5ace5b";
// $scope.ego[];
// $scope.pop[];
// $scope.active[];
$scope.brevity = 0;
// $scope.vis[];
$scope.likes = 0;
$scope.week=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
$scope.hashtag = 0;
$scope.hasLiked = 0;
$scope.posScore= 0;
$scope.days= 0;
// $scope.days[];
$scope.hasToken = true;
var token = window.location.hash;
console.log(token);
if (!token) {
	$scope.hasToken = false;
}
token = token.split("=")[1];

$scope.getInstaPics = function() {
	var path = "/users/self/media/recent";
	var mediaUrl = INSTA_API_BASE_URL + path;
	$http({
		method: "JSONP",
		url: mediaUrl,
		params: {
			'callback': "JSON_CALLBACK",
			'access_token': ACCESS_TOKEN
        // you need to add your access token here, as per the documentation
    }
}).then(function(response) {
	$scope.picArray = response.data.data;

	console.log(response.data.data);
	for(var i = 0; i < $scope.picArray.length; i++){
		$scope.likes = $scope.likes + $scope.picArray[i].likes.count;
		if($scope.picArray[i].user_has_liked){
			$scope.hasLiked++;
		}
		var words_arr = $scope.picArray[i].caption.text.split(" ");
		$scope.brevity = $scope.brevity + words_arr.length;
		$scope.hashtag = $scope.hashtag + $scope.picArray[i].tags.length;
		var date = new Date($scope.picArray[i].created_time * 1000);
		var day = date.getDay();
		$scope.days += day;
	};
	$scope.average = $scope.likes * 1.0 / $scope.picArray.length;
	$scope.ego = $scope.hasLiked / $scope.picArray.length * 100;
	$scope.brevity = $scope.brevity / $scope.picArray.length;
	$scope.hashtag = $scope.hashtag / $scope.picArray.length;
	$scope.days = $scope.days / $scope.picArray.length;
	$scope.days = $scope.week[parseInt($scope.days)];
	for(var i = 0; i < $scope.picArray.length; i++){
		analyzeSentiments(i);
	}
})
};

var analyzeSentiments = function(imgIdx) {
	
		var text_info = $scope.picArray[imgIdx].caption.text;
		$http({
			method: "GET",
			url: "https://twinword-sentiment-analysis.p.mashape.com/analyze/",
			params: {
				'text': text_info
			},
			headers: {
				'X-Mashape-Key': "s0DsGDMLUvmshYolWXRxJU0MhHyEp1UFY9fjsnArykmyUgf7KW",
			}
		}).then(function(response){
			console.log("i", imgIdx);
			$scope.picArray[imgIdx].pos = response.data;
			$scope.posScore += $scope.picArray[imgIdx].pos.score;
		});
}
});

var app = angular.module('App', ['ionic']);

app.controller('AppController', ['$scope', '$log', 'WordpressAPI', function($scope, $log, WordpressAPI){

    $scope.posts        = [];
    $scope.postPerPage  = 4;
    $scope.currentPage  = 1;
    $scope.totalPage    = 1;

    $scope.offset = function(){
        return ($scope.currentPage - 1) * $scope.postPerPage + 1;
    };

    $scope.refresh = function(){
        WordpressAPI.getBlogs($scope);
    };

    $scope.previousPage = function(){
        if($scope.totalPage == 1 || $scope.currentPage == 1){
            return false;
        }
        return true;
    };

    $scope.nextPage = function(){
        if($scope.totalPage == 1 || $scope.totalPage == $scope.currentPage){
            return false;
        }
        return true;
    };

    $scope.loadPrevious = function(){
        $scope.currentPage -= 1;
        WordpressAPI.getBlogs($scope);
    };

    $scope.loadNext = function(){
        $scope.currentPage += 1;
        WordpressAPI.getBlogs($scope);
    };

}]);

app.service('WordpressAPI', ['$http', '$log', function($http, $log){
    this.getBlogs = function($scope){
        var url = [
            'https://public-api.wordpress.com/',
            'rest/v1/sites/18296003/posts?',
            'offset=',
            $scope.offset(),
            '&page=',
            $scope.currentPage,
            '&number=',
            $scope.postPerPage,
            '&callback=JSON_CALLBACK'
        ].join('');

        $http.jsonp(url)
            .success(function(result){
                $scope.posts = result.posts;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.totalPage = Math.ceil(result.found / $scope.postPerPage)
                console.log($scope.totalPage);
            })
            .error(function(){

            });
    };
}]);

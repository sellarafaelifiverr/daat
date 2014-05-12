function newQuestionCtrl($scope, Data, $route, $routeParams, AuthService, $location){
    nqc = $scope;

    !AuthService.currentUser.fullName ? $location.path('/login') : '';

    $scope.submitNewQuestion = function(){
        var title = this.newQuestionTitle;
        var details = this.newQuestionDetails;
        var categoriesString = this.newQuestionCategories || "";
        var categoriesArr = _.without(_.map(categoriesString.split(/,/),function(i){return i.trim();}),""); //split by commas, remove surrounding whitespace, remove empty strings.
        //alert("submitting question with "+title+" and "+details);
        var cb = function(res){ location.hash = '#/questions/'+res.data.id };
        params = {title: title, details: details, categories: categoriesArr}
        Data.submitQuestion(params,cb);
    }
}
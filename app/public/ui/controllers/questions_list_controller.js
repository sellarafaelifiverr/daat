//main controller
function qListCtrl($scope, Data, $route, $routeParams,AuthService){
    //cheaters
    g1 = $scope;
    qs = function(){return $scope.data.qList};
    //g1.data.qList;
    //$routeParams.orderId
    $scope.foo = [10,20,30];

    $scope.route_type = $routeParams.type
    $scope.route_name = $routeParams.name
    //$scope.username = AuthService.currentUser().name;
    $scope.qList = Data.qList; //the client-side stub that works
    //$scope.data = {qList: Data.qList};
    $scope.origData = $scope.data;
    var getQuestionsParams = $routeParams
    Data.getQuestions(getQuestionsParams, function(response){
        questions = [].concat(response.data); //make sure it's an array

        //filter stuff out from each question
        function filterOut(question){
            if ($routeParams['userId']) {
                question.answers = _.filter(question.answers, function(a) {
                    return (a.owner.id == $routeParams['userId']);
                });
            }

            return question;
        }

        var data = questions.map(function(server_question ){
            var q = server_question;

            var question = {
                    id:   q.id,
                    title: q.title,
                    link: q.id,
                    body: q.text,
                    answers: _.map(q.answers,function(a){
                        a.getUpvotes = function(){ return a.upvoters.length; };
                        a.upvotersNames = function() { return _.map(a.upvoters,function(v){ return v.fullName}).join(", "); };
                        a.buttonText = a.upvoters;
                        a.isUpvotedByCurrentUser = function() { return a.upvoters[AuthService.currentUser.fullName]};
                        return a
                    })
            };

            question = filterOut(question);
            return question;
        });

        $scope.data = {qList: data};
        console.log("qList is ");
        console.log(g1.data.qList);
        //$scope.data = {qList: qList};        
    });

    $scope.submitAnswer = function(qid, myAnswer){
        var qid = this.data.qList[0].id;
        qid = encodeURIComponent(qid);
        var answer = this.myAnswer;
        Data.submitAnswer(qid, answer, function(res){ $route.reload();});
    }

    $scope.submitNewComment = function(params){
        params = {comment: this.newComment, answerId: params.aId, questionId: params.qId};
        Data.submitComment(params,function(){ alert("submitted comment to backend"); });
    }

    $scope.toggleUpvoteAnswer = function(question, answer) {
        var key = AuthService.currentUser.fullName;
        var alreadyUpvoted = !!_.findWhere(answer.upvoters, {fullName: key});
        var cb = function(result) {
            answer.upvoters = answer.upvoters || [];
            //nicefy this, and make it into a general add/remove-from-array method.
            alreadyUpvoted ? answer.upvoters = _.without(answer.upvoters, _.findWhere(answer.upvoters, {fullName: key})) : answer.upvoters.push({fullName: key});
        }

        Data.toggleUpvoteAnswer(question, answer, alreadyUpvoted, cb);
    }

    $scope.shortAnswer = function(answerBody){
        answerBody = answerBody || "";
        shortLengthChars = 100;
        shortAnswer = answerBody.length < shortLengthChars ? answerBody : answerBody.substring(0,shortLengthChars)+"... (עוד)"
        return shortAnswer;
    }

    $scope.allowAnswer = function(){
        var singleQuestion = $scope.singleQuestion();
        if (!singleQuestion) { return false; }
        var loggedInId = AuthService.currentUser.id;
        var alreadyAnswered = _.find(singleQuestion.answers, function(a){return a.owner.id == loggedInId});
        return loggedInId && !alreadyAnswered;
    }

    //returns the single question on page.
    $scope.singleQuestion = function() {
        var list = $scope.qList();
        return list && list.length == 1 && list[0];
    }

    //returns the list of questions on page.
    $scope.qList = function() {
        return $scope.data && this.data.qList;
    }
    $scope.answerUpvoted = function(answer){
        return _.findWhere(answer.upvoters, {fullName: AuthService.currentUser.fullName}) ? 'בטל לייק' : 'לייק!';
    }
}

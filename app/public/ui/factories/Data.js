myApp.factory('Data', function($http, AuthService) {
    http = $http;

    var genericErrHandler = function(res) {
        if (Math.random() < 0.3) { alert("Action failed, see JS console for details."); }
        msg = res.status+" on "+res.config.method+" to "+res.config.url+". Data was: "+res.data+" and config.data was: "+res.config.data;
        console.log(msg);
    };

    questionRoute = function(qId) { return '/questions/'+qId; };

    var res = {
        message: 'new data from a service',

        //routes
        getQuestions: function(params,cb){
            var route = params['id'] ? questionRoute(params['id']) : '/questions/newest';
            params['userId'] ? route = '/questions/users/'+params['userId'] : "";
            params['categoryId'] ? route = '/questions/category/'+params['categoryId'] : "";
            $http.get(route,{params: params}).then(cb);
            return "ok";
        },
        submitQuestion: function(params,cb){
            params['authToken'] = AuthService.currentUser.authToken;
            $http.post('/questions/new/',params).then(cb);
            return "ok";
        },
        submitComment: function(params,cb){
            params['authToken'] = AuthService.currentUser.authToken;
            var route = '/questions/'+params.questionId+'/answer/'+params.answerId+'/newComment';
            $http.post(route,params).catch(genericErrHandler);
            //$http.post('/questions/new/',params).then(cb);
            return "ok";
        },
        submitAnswer: function(params,cb){
            params['authToken'] = AuthService.currentUser.authToken;            
            $http.post('/questions/'+params['qid']+'/new_answer',params).then(cb);
            return "ok";
        },
        toggleUpvoteAnswer: function(question,answer, alreadyUpvoted, cb){
            params = {alreadyUpvoted: alreadyUpvoted};
            params['authToken'] = AuthService.currentUser.authToken;
            $http.post('/questions/'+question.id+'/answer/'+answer.id+'/toggleUpvote',params).catch(genericErrHandler);
            return "ok";
        },

        setQuestionCategories: function(q,cats,cb){
            params = {};
            params['authToken'] = AuthService.currentUser.authToken;
            params['categories'] = cats;
            $http.post('/questions/'+q.id+'/setCategories', params).then(cb);
        },

        updateAnswerText: function(qId, aId, newText) {
            params = {};
            params['authToken'] = AuthService.currentUser.authToken;
            params['newText'] = newText;
            $http.post('/questions/'+qId+'/answer/'+aId+'/updateText', params).catch(genericErrHandler);
        },

        updateQuestionTitle: function(qId, newTitle) {
            $http.post('/questions/'+qId+'/updateTitle',
                {authToken: AuthService.currentUser.authToken, newTitle: newTitle}).catch(genericErrHandler);
        },

        initA2A: function(qId, targetEmail, cb) {
            $http.post('/questions/'+qId+'/initA2A', {authToken: AuthService.currentUser.authToken, qId: qId, targetEmail: targetEmail}).then(cb).catch(genericErrHandler);
        },

        getEvents: function(opts, cb) { $http.get('/events').then(cb) },
//        addCategoryToQuestion: function(question,categoryName,cb){
//            params = {categoryName: categoryName};
//            params['authToken'] = AuthService.currentUser.authToken;
//            $http.post('/questions/'+question.id+'/addCategory', params).then(cb);
//        },
//        removeCategoryFromQuestion: function(question,categoryName,cb){
//            params = {categoryName: categoryName};
//            params['authToken'] = AuthService.currentUser.authToken;
//            $http.post('/questions/'+question.id+'/removeCategory', params).then(cb);
//        },
        signup: function(params, cb){ $http.post('/signup',params).then(cb); },
        login: function(params, cb){ $http.post('/login',params).then(cb); },
        ping: function(){$http.get('/ping').then(log,log)},
        fbEnter: function(params,cb) { $http.post('/fbEnter', params).then(cb); }
    };

    data = res; Data = res; //globals, for debugging.
    return res;
});
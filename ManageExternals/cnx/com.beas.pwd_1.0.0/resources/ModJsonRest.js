define([
        'dojo/_base/xhr',
        'dojo/_base/lang',
        'dojo/json',
        'dojo/_base/declare',
        'dojo/store/util/QueryResults',
        'dojo/store/JsonRest'
        ], function(xhr, lang, JSON, declare, QueryResults, JsonRest){
	return declare("com.beas.pwd.ModJsonRest", JsonRest, {
		constructor: function(options){
			// summary:
			//              This is a basic store for RESTful communicating with a server through JSON
			//              formatted data.
			// options: dojo/store/JsonRest
			//              This provides any configuration information that will be mixed into the store
			this.headers = {};
			declare.safeMixin(this, options);
		},
		query: function(query, options){
			// summary:
			//              Queries the store for objects. This will trigger a GET request to the server, with the
			//              query added as a query string.
			// query: Object
			//              The query to use for retrieving objects from the store.
			// options: __QueryOptions?
			//              The optional arguments to apply to the resultset.
			// returns: dojo/store/api/Store.QueryResults
			//              The results of the query, extended with iterative methods.
			//
			// !!!!! This function is overwritten to have the items also as query options not only in the html header as the
			// !!!!! domino server can not read the header.
			//
			options = options || {};

			var headers = lang.mixin({ Accept: this.accepts }, this.headers, options.headers);

			var hasQuestionMark = this.target.indexOf("?") > -1;

			if(query && typeof query == "object"){
				query = xhr.objectToQuery(query);
				query = query ? (hasQuestionMark ? "&" : "?") + query: "";
			}

			if(options.start >= 0 || options.count >= 0){
				headers.Range = headers["X-Range"] //set X-Range for Opera since it blocks "Range" header
				= "items=" + (options.start || '0') + '-' +
				(("count" in options && options.count != Infinity) ?
						(options.count + (options.start || 0) - 1) : '');
				// This has been added to have the items also as query parameter to support IBM Domino servers.
				query += (query || hasQuestionMark ? "&" : "?") + ("items=" + (options.start || '0') + '-' +
						(("count" in options && options.count != Infinity) ?
								(options.count + (options.start || 0) - 1) : ''));
			}
			if(options && options.sort){
				var sortParam = this.sortParam;
				query += (query || hasQuestionMark ? "&" : "?") + (sortParam ? sortParam + '=' : "sort(");
				for(var i = 0; i<options.sort.length; i++){
					var sort = options.sort[i];
					query += (i > 0 ? "," : "") + (sort.descending ? this.descendingPrefix : this.ascendingPrefix) + encodeURIComponent(sort.attribute);
				}
				if(!sortParam){
					query += ")";
				}
			}
			var results = xhr("GET", {
				url: this.target + (query || ""),
				handleAs: "json",
				headers: headers
			});
			results.total = results.then(function(){
				var range = results.ioArgs.xhr.getResponseHeader("Content-Range");
				return range && (range = range.match(/\/(.*)/)) && +range[1];
			});
			return QueryResults(results);
		}
	});
});


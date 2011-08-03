/**
 *
 */
var Person = function(rdfVocabularyObject) {
	this.rdfObj = rdfVocabularyObject;
	this.name = this.rdfObj.get("name");
};


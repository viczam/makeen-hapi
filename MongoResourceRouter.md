# MongoResourceRouter.js API documentation

<!-- div class="toc-container" -->

<!-- div -->

## `Methods`
* <a href="#applyContext">`applyContext`</a>
* <a href="#constructor">`constructor`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `Methods`

<!-- div -->

<h3 id="applyContext"><a href="#applyContext">#</a>&nbsp;<code>applyContext(options, routes, options.generateContext)</code></h3>
[&#x24C8;](https://github.com/makeen-project/makeen/blob/develop/ci-scripts/helper-functions.sh#L359 "View in source") [&#x24C9;][1]



#### Arguments
1. `options` *(object)*: options passed to method
2. `routes` *(array)*: array of routes for which to apply context
3. `options.generateContext` *(generateContext)*: function that will generated the context to be applied

---

<!-- /div -->

<!-- div -->

<h3 id="constructor"><a href="#constructor">#</a>&nbsp;<code>constructor(Repository, config)</code></h3>
[&#x24C8;](https://github.com/makeen-project/makeen/blob/develop/ci-scripts/helper-functions.sh#L45 "View in source") [&#x24C9;][1]

Create a new MongoResourceRouter instance

#### Arguments
1. `Repository` *(object)*: repository service used to perform all data related operations
2. `config` *(object)*: configuration options which can have the following fields:<br>
entitySchema - joi schema of the corespoding data entity

---

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #methods "Jump back to the TOC."

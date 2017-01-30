VERSION := patch

release:
	echo "Releasing version: $(VERSION)"
	git checkout master
	git pull origin master
	npm run transpile
	npm run dist
	npm version $(VERSION)
	npm publish
	git push origin master --follow-tags

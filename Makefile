build: components index.js 
	@component build --dev

%.html: %.jade
	jade $<

test: build example/example.html

components: component.json
	@component install --dev

clean:
	rm -fr build components 

.PHONY: clean

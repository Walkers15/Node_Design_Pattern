---


---

<h1 id="장-node.js-필수-패턴">2장 Node.js 필수 패턴</h1>
<p>동기식 프로그래밍에서는 특정 문제를 해결하기 위해 연속적인 단계로 코드를 생각하게 된다. 즉 모든 작업이 블로킹이므로, 현재 작업이 완료될 때까지 기다린 후에 다음 작업을 실행할 수 있다.</p>
<p>비동기식으로 작업을 처리하면, 앞에서 요청한 작업의 종료 여부와 관계없이 그 다음 작업을 시작한다. 대신 백그라운드에서 실행중인 작업은 언제든지 완료될 수 있으며, 비동기 호출이 완료되면 적절한 방식으로 반응하도록 프로그래밍해야 한다.<br>
이러한 논-블로킹(작업의 완료를 기다리지 않음) 방식은 항상 우수한 성능을 가지지만, 복잡한 제어 흐름이 필요한 애플리케이션에서는 설계하기 까다로움.</p>
<p>이를 위해 Node.js에서는 <strong>콜백</strong> 과 <strong>이벤트 이미터</strong> 라는 두 가지 비동기 패턴을 사용함.</p>
<h2 id="콜백-패턴">2.1 콜백 패턴</h2>
<p>리액터 패턴 핸들러의 구현<br>
<strong>작업 결과를 전달</strong>하기 위해 호출. 비동기 작업을 위해 필수!<br>
자바스크립트에서는 함수가 일급 클래스 객체이므로, 변수에 할당하거나 인자로 전달하고, 다른 함수 호출에서 반환하거나 자료구조에 저장할 수 있기 때문에, 콜백을 쉽게 표현할 수 있다.</p>
<p>콜백을 구현하는 또 다른 이상적인 구조는 <strong>클로저</strong>이다.<br>
클로저를 사용하면 실제로 함수가 작성된 환경을 참조할 수 있다.<br>
콜백이 언제 어디서 호출되는 지에 관계없이 비동기 작업이 요청된 컨텍스트를 항상 유지할 수 있기 때문이다.</p>
<h3 id="연속-전달-방식">연속 전달 방식</h3>
<p>JS에서 콜백은 다른 함수에 <strong>인수로 전달되는 함수</strong>이며, 작업이 완료되면 결과로 호출된다.<br>
함수형 프로그래밍에서 결과를 전달하는 이러한 방식을 연속 전달 방식(The Continuation-passing Style,CPS)라고 한다.</p>
<h4 id="동기식-연속-전달-방식">동기식 연속 전달 방식</h4>
<pre><code>function add(a, b){
	return a + b;
}
</code></pre>
<p>return문을 이용해 호출자에 결과를 전달하는 방식을 **직접 스타일(Direct Style)**라고 하며, 동기화 프로그래밍에서 일반적으로 결과를 반환하는 방식이다.</p>
<p>이를 연속 전달 방식으로 바꾸면 다음과 같다.</p>
<pre><code>function add(a, b, callback){
	callback(a+b);
}
</code></pre>
<p>add()함수는 동기화된 CPS 함수로, 콜백이 완료될 때만 값을 반환한다.</p>
<pre><code>print("전")
add(1, 2, result =&gt; print("결과 :",result))
print("후")
//결과
전
3
후
</code></pre>
<p>아래와 같이 비동기식으로 작성하면, 결과는 다음과 같다.</p>
<pre><code>function addAsync(a, b, callback){
	setTimeout(() =&gt; callback(a+b),100);
}
//결과
전
후
3
</code></pre>
<p>비동기 작업이 완료되면 실행은 비동기 함수에 제공된 콜백에서부터 다시 실행된다.<br>
실행은 <strong>이벤트 루프</strong>에서 시작되기 때문에 새로운 스택을 가진다.<br>
<strong>클로저</strong> 덕분에 콜백이 다른 시점과 다른 위치에서 호출되더라도, 비동기 함수의 호출자 컨텍스트를 유지할 수 있다.</p>
<h4 id="비-연속-전달-방식의-콜백">비 연속 전달 방식의 콜백</h4>
<p>함수에 콜백 인자가 있어도, 함수가 비동기식나 연속 전달 스타일이 아닐 수 있다.</p>
<pre><code>const result = [1, 5, 7].map(element =&gt; element -1);
console.log(result);
</code></pre>
<p>위 구문에서, 콜백은 단지 배열 내의 요소를 반복하는데 사용될 뿐, 연산 결과를 전달하지 않는다.</p>
<h3 id="동기냐-비동기냐">동기냐 비동기냐?</h3>
<p>가장 위험한 상황 중 하나는 조건문 등으로 분기 처리한 블록이 하나는 동기식이고 하나는 비동기식인 경우다.</p>
<p>캐싱되어 있는 파일과 그렇지 않은 파일을 읽는 프로그램이 있다고 가정했을 때, 파일을 읽는 함수가 결과를 반환할때까지 캐시가 결정되지 않은 경우 비동기식으로 작동한다. 하지만 캐시가 이미 있는 파일에 대한 모든 후속 요청에 대해서는 동기식으로 변해 즉각적으로 콜백을 호출하므로 위험하다.</p>
<p>이렇게 동기 / 비동기식이 혼용될 가능성이 있는 프로그램을 짜는 것을 <strong>Zalgo를 풀어놓는다</strong>고 한다.</p>
<h4 id="동기-api의-사용">동기 API의 사용</h4>
<p>Zalgo의 사례에서 알 수 있는 교훈은, API의 동기 또는 비동기 특성을 명확하게 정의하는 것이 필수적이라는 것이다.</p>
<p>동기 API를 사용하면, 혼란이 줄어들고 성능 측면에서 보다 효율적일 수 있다.<br>
하지만 동기 API를 반복적으로 사용할 경우, JS의 동시성 모델을 깨뜨리므로 전체 어플리케이션의 속도를 떨어뜨릴 수 있다.<br>
따라서, <strong>어플리케이션이 동시 요청을 처리하는 데 영향을 주지 않는 경우에만 블로킹 API를 사용하여야 한다.</strong></p>
<h4 id="지연-실행">지연 실행</h4>
<p>API의 동기/비동기 혼용을 막기 위해서는 위에서처럼 전부 동기식으로 만드는 방법도 있지만, 완전히 비동기로 만드는 방법도 있다.</p>
<p>구문을 비동기식으로 만드는 트릭을 노드에서는 두 가지 정도를 제공한다.<br>
하나는 process.nextTick()을 사용하는 것이다.</p>
<pre><code>process.nextTick(() =&gt; callback(cache[filename]));
</code></pre>
<p>process.nextTick()은 이벤트 루프의 다음 사이클까지 함수의 실행을 지연시킨다. 즉, 콜백을 인수로 취하여, 대기 중인 I/O이벤트의 ** 맨 앞** 으로 밀어 놓고 즉시 반환한다. 그러면 콜백은 이벤트 루프가 다시 실행되는 즉시 호출된다.</p>
<p>또 다른 방법은, setImmediate()를 사용하는 것이다. setImmediate()는 이미 큐에 있는 다른 I/O이벤트들의 <strong>맨 뒤</strong>에 콜백을 대기시킨다.</p>
<h3 id="node.js-콜백-규칙">Node.js 콜백 규칙</h3>
<p>코어 및 대부분의 사용자 정의 모듈 및 앱에 적용되는 비동기 API 규칙이 있다.</p>
<p>** 콜백을 맨 마지막에**</p>
<pre><code>fs.readFile(filename,[options],callback);
</code></pre>
<p>다른 옵션이 있더라도, 콜백은 항상 마지막 위치에 놓아야 한다.<br>
이 규칙의 이유는 콜백이 적절한 위치에 정의되어 있는 경우, 함수 호출의 가독성이 더 좋기 때문이다.</p>
<p><strong>오류는 맨 앞에</strong><br>
연속 전달 스타일(CPS)에서는 오류가 다른 유형의 결과처럼 제공되므로, 콜백 사용이 필요하다. 노드에서 CPS함수에 의해 생성된 오류는 항상 콜백의 첫 번째 인수로 전달되며, 실제 결과는 두 번째 인수에서부터 전달된다.<br>
동작이 에러 없이 성공하면, 첫 번째 인수는 null 혹은 undefined이다.</p>
<pre><code>fs.readFile('foo.txt','utf8',(err,data)=&gt;{
	if(err){
		errorhandler(err);
	} else {
		processData(data);
	}
});
</code></pre>
<p>에러가 있는지 항상 체크하는 것이 좋다.<br>
<strong>오류 전파</strong><br>
동기식 직접 스타일 함수의 오류 전파는 throw문을 사용하여 수행되므로, 오류가 catch될 때까지 호출 스택에서 실행된다.</p>
<p>하지만 비동기식 CPS 에서, 적절한 오류 전달은 오류를 호출 체인의 다음에서 콜백으로 전달하여 수행된다.</p>
<pre><code>const fs = require('fs');
function readJSON(filename, callback){
	fs.readFIle(filename,'utf8',(err, data)=&gt;{
		let parsed;
		if(err){
			return callback(err)
		}
		try{
			parsed = JSON.parse(data);
		} catch(err){
			return callback(err);
		}
		callback(null,parsed);
	});
};
</code></pre>
<p>유효한 결과를 전달할 때 첫 번째 인자는 null이다.<br>
또한, 에러를 전파할 때 <strong>return</strong>을 사용한다.<br>
콜백 함수가 호출되는 즉시 함수에서 빠져 나와 그 다음 줄이 실행되지 않는다.</p>
<p><strong>캐치되지 않는 예외</strong><br>
노드에서는 캐치되지 않는 에러에 대해 uncaughtException이라는 특수 이벤트를 내보낸다.<br>
캐치되지 않은 예외가 어플리케이션의 일관성을 보장할 수 없는 상태로 만든다.<br>
이로 인해 예기치 않은 문제가 발생할 수 있다.<br>
따라서, 잡히지 않은 예외가 수딘되면 항상 어플리케이션을 종료하는 것이 중요하다.</p>
<h2 id="모듈-시스템과-그-패턴">2.2 모듈 시스템과 그 패턴</h2>
<p>모듈은 복잡한 어플리케이션을 구성하기 위한 블록 역할을 하기도 하지만, 명시적으로 익스포트 표시되지 않은 모든 내부적인 함수와 변수들을 비공개로 유지하며 정보를 숨기는 중요한 매커니즘이기도 하다.</p>
<h3 id="노출식-모듈-패턴">노출식 모듈 패턴</h3>
<p>JS의 주요 문제점 중 하나가 네임스페이스가 없다는 점이다.<br>
전역 범위에서 실행되는 프로그램은 내부 어플리케이션과 종속된 라이브러리 코드의 데이터들로 인해 충돌이 발생할 수 있다.<br>
이를 해결하기 위한 보편적인 기법을, 노출식 모듈 패턴이라고 한다.</p>
<pre><code>const module = (()=&gt;{
	const privateFoo = () =&gt; { ... };
	const privateBar = [];
	
	const exported = {
		publicFoo: () =&gt; { ... },
		publicBar: () =&gt; { ... }
	};
	return exported;
})();
console.log(module);
</code></pre>
<p>위 패턴은 자기 호출 함수를 사용하여 private 범위를 만들고, 공개될 부분만 익스포트한다. console.log로 출력하는 변수는 exported된 API만 포함하고 있으며, 나머지 모듈 내부의 콘텐츠는 실제로 외부에서 액세스할 수 없다.</p>
<h3 id="node.js-모듈-설명">Node.js 모듈 설명</h3>
<p>JS생태계를 표준화하려는 목표를 가진 CommonJS그룹의 모듈인 <strong>CommonJS 모듈</strong>이 있다. 노드는 사용자 정의 확장을 추가하여 이 스펙 위에 모듈 시스템을 구축했다. 각 모듈이 private 범위에서 실행되어, 로컬로 정의된 모든 변수가 전역의 네임스페이스와 충돌하지 않는다.</p>
<p>즉, module.exports 변수에 할당되지 않은 한, 모듈 내부의 모든 항목은 <strong>private</strong> 이다.</p>
<h4 id="전역-정의">전역 정의</h4>
<p>노드의 모듈 시스템은, <em>global</em>이라는 특수 변수를 노출하고 있다. 이 변수에 할당된 모든 항목은 자동으로 전역 범위에 있게 된다. 다만, 이는 모듈 시스템의 장점을 무효화시킨다. 따라서 전역 범위를 많이 사용하는 것은 좋지 않은 습관이다.</p>
<h4 id="module.exports-vs.-exports">module.exports vs. exports</h4>
<p><strong>변수 exports는 module.exports의 초기 값에 대한 참조일 뿐이다.</strong></p>
<pre><code>#exports는 간단한 객체 리터럴일 뿐인다.
const module = {
	export: {}, //진짜 이 익스포트!
	id: id
};

#즉, exports가 참조하는 객체에만 새로운 속성(프로퍼티)을 추가할 수 있다.
exports.hello = () =&gt; {
	console.log('Hello');
}

#exports 변수의 제할당은 module.exports의 내용을 변경하지 않으므로,
#아무런 효과가 없다.

exports = () =&gt; {
	console.log('Hello');
} //효과 없는 코드.

## 따라서, 함수, 인스턴스, 또는 문자열과 같은
## 객체 리터럴 이외의 것을 내보내려면 다음과 같이 해야 한다.
module.exports = () =&gt; {
	console.log('Hello');
}
</code></pre>
<h4 id="require-함수는-동기적이다.">require 함수는 동기적이다.</h4>
<p>노드의 require함수는 동기적이다.<br>
즉, 모듈을 정의할 떄는 주로 <strong>동기적 코드</strong>를 사용한다.</p>
<pre><code># 올바르지 않은 코드
setTimeout(() =&gt; {
	module.exports = function() { ... };
}, 100);
</code></pre>
<p>모듈을 비동기적으로 초기화해야 하는 과정이 필요한 경우에는, 모듈이 미래 시점에 비동기적으로 초기화되기 때문에, 미처 초기화되지 않은 모듈을 정의하고 익스포트할수도 있다. 따라서 이런 접근 방식의 문제점은, require를 사용하여 모듈을 로드한다고 해서 사용할 준비가 된다는 보장이 없다.</p>
<h4 id="해결resolving-알고리즘">해결(resolving) 알고리즘</h4>
<p><em>의존성 지옥</em>이라는 용어는, 소프트웨어의 의존성이 서로 공통된 라이브러리를 의존하지만 서로 다른 버전을 필요로 하는 상황을 나타낸다.<br>
Node.js라는 모듈은, 로드되는 위치에 따라 다른 버전의 모듈을 로드할 수 있도록 하여 이 문제를 해결한다.</p>
<p>require 함수에서 사용하는 resolving 알고리즘을 살펴보자.<br>
resolve() 함수는, 모듈 이름을 입력으로 사용하여 모듈 전체의 경로를 반환한다.<br>
다음과 같이 크게 세 가지로 나눌 수 있다.</p>
<ul>
<li>파일 모듈 : 모듈이름이 '/'로 시작하면, 이미 모듈에 대한 절대 경로로 간주되어 그대로 반환한다. './'로 시작하면 모듈 이름은 상대 경로로 간주되며, 이는 요청한 모듈로부터 시작하여 계산된다.</li>
<li>코어 모둘 : 모듈 이름이 ‘/’ 또는 './'로 시작하지 않으면, 알고리즘은 우선 코어 Node.js모듈(fs 등) 내에서 검색을 시도한다.</li>
<li>패키지 모듈 : 모듈 이름과 일치하는 코어 모듈이 없을 경우, 요청 모듈의 경로에서 시작하여 디렉터리 구조를 탐색하여 올라가면서 node_modules 디렉터리를 찾고 그 안에서 일치하는 모듈을 찾기를 계속한다.</li>
</ul>
<p>위 알고리즘을 기반으로, 각 패키지는 자체적으로 개별적인 의존성을 가질 수 있다.<br>
즉, 각 패키지마다 node_modules 폴더를 따로 두어 버전 호환성 문제를 해결할 수 있다.</p>
<h4 id="모듈-캐시">모듈 캐시</h4>
<p>require()의 후속 호출은 단순히 캐시된 버전을 반환하기 떄문에, 각 모듈은 처음 로드될 때만 로드되고 평가(eval)된다. 캐싱은 성능을 위해 매우 중요하지만, 다음과 같은 기능적인 영향도 있다.</p>
<ul>
<li>모듈 의존성 내에서 순환을 가질 수 있다.</li>
<li>일정한 패키지 내에서 동일한 모듈이 필요할 때는 어느 정도 동일한 인스턴스가 항상 반환된다는 것을 보장한다.</li>
</ul>
<h4 id="순환-의존성">순환 의존성</h4>
<p>순환 의존성이 무엇인가?</p>
<pre><code>#Moudle a.js:
exports.loaded = false;
const b = require('./b');
module.exports = {
	bWasLoaded: b.loaded,
	loaded: true
};

#Module b.js:
exports.loaded = false;
const a = require('./a');
module.exports = {
	aWasLoaded : a.loaded,
	loaded: true
};

#main.js
const a = require('./a');
const b = require('./b');
console.log(a);
console.log(b);

###결과###
{ bWasLoaded: true, loaded: true }
{ aWasLoaded: false. loaded: true }
</code></pre>
<h3 id="모듈-정의-패턴">모듈 정의 패턴</h3>
<p>모듈 시스템은 의존성을 로드하는 매커니즘이 되는 것 외에 API를 정의하기 위한 도구이기도 하다. API 디자인과 관련된 다른 문제의 경우 고려해야 할 주요 요소는 private 함수와 public 함수 간의 균형이다. 이것의 목표는 확장성과 코드 재사용 같은 소프트웨어의 품질과의 균형을 유지하면서 정보 은닉 및 API 유용성을 극대화하는 것이다.</p>
<h4 id="exports-지정하기">exports 지정하기</h4>
<p>public API를 공개하는 가장 기본적인 방법은 exports로 명기하는 것이다.<br>
이것은 exports에서 참조하는 객체(또는 module.exports)의 속성에 공개할 모든 값을 할당하는 것이다. 이렇게 하면 외부에 공개된 객체(모듈)가 일련의 관련 기능들에 대한 컨테이너 혹은 네임스페이스가 된다.</p>
<p>CommonJs의 명세에는, public 멤버들을 공개하는데 exports 변수만을 사용하도록 하고 있다.<br>
따라서 exports로 지정하는 것이 CommonJS의 명세와 호환되는 유일한 방식이다.<br>
module.exports는 Node.js가 제공하는 모듈 정의 패턴의 광범위한 범위를 지원하기 위한 것이다. 즉, exports의 확장 기능이라고 볼 수 있다.</p>
<h4 id="함수-내보내기">함수 내보내기</h4>
<p>가장 일반적인 모듈 정의 패턴 중 하나가 module.exports 변수 전체를 함수에 재할당하는 것이다. 주요 장점은 모듈에 대한 명확한 진입점을 제공하는 단일 기능을 제공하여 그걸에 대한 이해와 사용을 단순화한다는 것이다.<br>
모듈을 이런 식으로 정의하는 방법은, substack 패턴으로 알려져 있다.</p>
<pre><code>//logger.js
module.exports = (message) =&gt; {
	console.log(`info: ${message}`);
};
</code></pre>
<p>생각해 볼 수 있는 이 패턴의 응용은, 익스포트된 함수를 다른 public API의 네임스페이스로 사용하는 것이다. 이렇게 하면, 모듈의 단일 진입점의 명확성을 제공하므로 매우 강력한 조합이다.<br>
또한 이 접근 바식을 응용하여 그 이상의 고급 유스케이스를 만들 수 있는 다른 부가적인 기능들을 노출할 수 있다.</p>
<pre><code>module.exports.verbose = (message) =&gt; {
	console.log(`verbose: ${message}`);
};
</code></pre>
<pre><code>#main.js
const logger = require('./logger');
logger('This is an info message');
logger.verbose('This is a verbose message');
</code></pre>
<p>단순히 함수만을 내보내는 것이 제약처럼 보일 수도 있지만, 실제로는 단일 기능에 중점을 둔 완벽한 방법이며, 내부 정보들을 은닉하며 이외 보조적인 사항들은 익스포트된 함수의 속성으로 노출하여 단일 진입점을 제공한다.<br>
노드의 모듈성은 <strong>한 가지만 책임지는 원칙</strong>을 지킬 것을 강력히 권장한다.</p>
<h4 id="생성자-익스포트하기">생성자 익스포트하기</h4>
<p>생성자를 익스포트하는 모듈은 함수를 내보내는 모듈이 특화된 것이다.<br>
차이점은 이 패턴을 통해 사용자에게 생성자를 사용하여 새 인스턴스를 만들 수 있게 하면서, 프로토타입을 확장하고 새로운 클래스를 만들 수 있는 기능도 제공할 수 있다는 것이다.</p>
<p>생성자나 클래스를 내보내는 것은 여전히 모듈에 대한 단일 진입점을 제공하지만, 서브스택 패턴과 비교했을 때 모듈 내부를 훨씬 더 많이 노출한다. 그러나 다른 한편으로는 기능 확장에 있어 훨씬 더 강력할 수 있다.</p>
<p>new 명령을 사용하지 않는 호출에 대해 보호자를 적용(new 가 아닌 명령에 대해 보호자를 적용하는 것으로 구성된다.)</p>
<pre><code># ES2015의 new.target 구문을 사용하면,
# 함수가 new 키워드를 사용하여 호출된 경우
# 런타임 시에 true로 평가된다.
function Logget(name) {
	if(!new.target){
		return new LoggerConstructor(name);
	}
	this.name = name;
}
</code></pre>
<p>위 경우 new를 사용하여 함수를 호출하지 않았을 경우, 새 인스턴스를 올바르게 생성한 후 호출자에게 반환한다.</p>
<h4 id="인스턴스-익스포트-하기">인스턴스 익스포트 하기</h4>
<p>require() 함수는 캐싱 메커니즘을 이용하여 생성자나 팩토리를 통해 모듈을 생성하므로 서로 다른 모듈 간에 공유될 수 있는 상태 저장 인스턴스를 쉽게 정의할 수 있다.</p>
<pre><code># logger.js
function Logger(name){
	this.count = 0;
	this.name = name;
}
Logger.prototype.log = function(message){
	this.count++;
	console.log('[' + this.name + ']' + message);
};
module.exports = new Logger('DEFAULT');
</code></pre>
<p>이렇게 새로 정의된 모듈은 다음과 같이 사용할 수 있다.</p>
<pre><code>const logger = require('./logger');
logger.log('This is an infomational message');
</code></pre>
<p>위와 같은 패턴의 확장은 인스턴스를 생성하는데 사용되는 생성자를 노출(exports)하는 것으로 구성된다. 아래와 같이, module.exports 인스턴스에 새 속성을 지정하면 된다.</p>
<pre><code>module.exports.Logger = Logger;
</code></pre>
<p>위 생성자를 이용하여 클래스의 다른 인스턴스를 만들 수 있다.</p>
<pre><code>const customLogger = new logger.Logger('CUSTOM');
customLogger.log('This is an informational message');
</code></pre>
<p>이것은 exports된 함수를 네임스페이스로 사용하는 것과 유사하다.<br>
모듈은 객체의 기본 인스턴스를 익스포트하지만, 새로운 인스턴스를 생성하거나 객체를 확장하는것과 같은 좀더 고급 기능은 여전히 속성을 노출(module.exports.attribute)함을 통해 수행할 수 있다.</p>
<h4 id="다른-모듈-혹은-글로벌-스코프global-scope-수정">다른 모듈 혹은 글로벌 스코프(global scope) 수정</h4>
<p><em>범위를 벗어난 요소들의 상태에 영향을 미치므로, 이 방법은 매우 위험하다.</em></p>
<pre><code># patcher.js 파일

##logger.js는 다른 파일!
require('./logger').customMessage = () =&gt; console.log('This is a new functionality');
</code></pre>
<p>이렇게 아무것도 익스포트 하지 않는 모듈이 있을 수 있다.<br>
이렇게 모듈이 전역 범위의 다른 모듈이나 객체를 수정할 수 있을 때, 이것을 몽키 패치라고 한다.<br>
이를 적용하는 방법은 아래와 같다.</p>
<pre><code>#반드시 몽키 패쳐 모듈을 먼저 호출해야 함!
require('./patcher');
const logger = require('./logger');
logger.customMessage();
</code></pre>
<h2 id="관찰자-패턴the-observer-pattern">2.3 관찰자 패턴(The observer Pattern)</h2>
<p>리액터, 콜백, 모듈과 함께 노드에서 사용되는 또 다른 중요하고 기본적인 패턴은 <strong>관찰자 패턴</strong>이다.<br>
관찰자 패턴은 노드의 반응적인(Reactive) 특성을 모델링하고 콜백을 완벽하게 보완하는 이상적인 해결책이다.<br>
<em><strong>관찰자 패턴</strong>은 상태 변화가 일어날 때 관찰자(또는 Listener)에게 <strong>알릴 수 있는 객체</strong>(Subject)를 정의하는 것이다.</em></p>
<p>콜백 패턴과의 가장 큰 자이점은, Subject가 실제로 여러 관찰자들에게 <strong>알릴 수 있다</strong>는 점이다. 전통적인 연속 전달 스타일 콜백은 일반적으로 그 결과를 <strong>하나의 Listener</strong>에게만 전파했다.</p>
<h3 id="eventemitter-클래스">EventEmitter 클래스</h3>
<p>전통적 OOP 의 관찰자 패턴에는 인터페이스와 구현된 클래스들, 그리고 계층 구조가 필요했다.<br>
하지만 노드에서는 이를 훨씬 쉽게 구현할 수 있다.<br>
관찰자 패턴은 이미 코어에 내장되어 있으며, EventEmitter 클래스를 통해 사용할 수 있다.<br>
다음과 같은 코드로 EventEmitter에 대한 참조를 얻을 수 있다.</p>
<pre><code>const EventEmitter = require('events').EventEmitter;
const eeInstance = new EventEmitter();
</code></pre>
<p>EventEmitter의 필수 메소드는 다음과 같다.</p>
<ul>
<li>on(event, listener) : 주어진 유형(문자열 - event) 에 대해 새로운 listener를 등록한다. listener는 보통 함수…?</li>
<li>once(event, listener) : 일회성 이벤트를 등록한다.</li>
<li>emit(event, [arg1],[…]) : 새 이벤트를 생성하고 listener에게 전달할 추가적인 인자를 지원한다.</li>
<li>removeListener(event, listener) : 이 메소드는 지정된 이벤트 유형에 대한 listener를 제거한다.</li>
</ul>
<h4 id="오류-전파">오류 전파</h4>
<p>EventEmitter는 이벤트가 비동기적으로 발생할 경우, 콜백에서와 같이 예외를 바로 throw할 수 없다. 대신 'error’라는 특수한 이벤트를 발생시키고, Error객체를 인자로 전달한다.</p>
<h4 id="관찰-가능한-객체-만들기">관찰 가능한 객체 만들기</h4>
<p>EventEmitter 클래스를 확장해서, 관찰 가능한 객체를 만들 수 있다.</p>
<pre><code>class 클래스명 extends EventEmitter {
	...
	this.emit('event',...)
	...
}
</code></pre>
<p>위와 같이 EventEmitter를 extend하면, 노드가 알아서 확장해준다. 따라서 완벽하게 관찰 가능한 클래스가 되므로, this.emit를 사용하여 이벤트를 발생시킬 수 있다.</p>
<p>이것은 노드에서 상당히 일반적이다.<br>
예시로, 핵심 HTTP 모듈인 Server객체는 listen(), close(), setTimeout()과 같은 메소드를 정의하여 내부적으로 EventEmitter 함수에서 상속받는다.<br>
따라서 새로운 요청이 수신될 때 request 이벤트, 새로운 연결이 설정되면 connection 이벤트, 서버가 닫히면 close이벤트가 생성된다.</p>
<h3 id="동기-및-비동기-이벤트">동기 및 비동기 이벤트</h3>
<p>이벤트도 콜백과 마찬가지로 동기식 또는 비동기식으로 설정할 수 있다.<br>
앞서 콜백에서 처럼 동기와 비동기식을 <strong>섞어서는 안된다.</strong><br>
동기/비동기를 발생기키는 주된 차이점은 리스너를 등록할 수 있는 방법에 있다.<br>
이벤트가 비동기식으로 발생하면 EventEmitter 가 초기화된 후에도 프로그램은 새로운 리스너를 등록할 수 있다.<br>
이벤트가 이벤트 루프의 다음 사이클이 될 때까지는 실행되지 않을 것이기 때문이다.<br>
이벤트를 동기적으로 발생시키려면 EventEmitter 함수가 이벤트를 방출하기 전에 모든 리스너가 등록되어 있어야 한다.</p>
<h3 id="eventemitter-vs-콜백">EventEmitter vs 콜백</h3>
<p>비동기식 API를 정의할 때 항상 고민인 것은, EventEmitter를 사용할지, 혹은 단순하게 콜백을 사용할지 결정하는 것이다. 일반적으로 결과가 비동기 방식으로 변환되어야 할 때는 콜백을 사용한다. 대신 일어난 무엇인가를 <strong>전달</strong>할 필요가 있을 때 이벤트를 사용한다.</p>
<p>또한 또 다른 기준은, EventEmitter는 동일한 이벤트가 여러 번 발생할 수도 있고 전혀 발생하지 않을 수도 있는 경우에 더 좋다. 또한 결과보다는 정보가 전달되어야 하는 경우에 더 좋다.<br>
반대로 콜백은, 작업의 성공 여부와 관계없이 반드시 정확히 한 번만 호출되어야 한다.</p>
<p>마지막으로 콜백을 사용하는 API는 특정 콜백에만 알릴 수 있지만 EventEmitter함수를 사용하면 여러 수신자가 동일한 알림을 수신할 수 있다.</p>
<h2 id="요약">2.4 요약</h2>
<ul>
<li>동기 코드와 비동기 코드의 차이<br>
동기식은 연속적이고, 블로킹이다. 비동기식은 비연속적이고 논-블로킹이다.<br>
동기식은 하나의 작업이 끝나기 전까지 프로그램의 흐름이 넘어가지 않는다.<br>
노드는 이벤트 루프를 이용한 비동기식 작업을 한다.</li>
</ul>


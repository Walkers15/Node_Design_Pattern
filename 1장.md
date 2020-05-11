---


---

<h1 id="장--node.js-플랫폼">1장  Node.js 플랫폼</h1>
<h2 id="node.js-철학">1.1 Node.js 철학</h2>
<h3 id="경량-코어">경량 코어</h3>
<p>코어를 최소의 기능 세트로 하고, 나머지를 사용자 영역으로 하여, 핵심 모듈의 바깥 영억 모듈들을 생태계에 맡기는 것</p>
<h3 id="경량-모듈">경량 모듈</h3>
<p>Node.js는 모듈 개념을 프로그램 코드를 구성하는 기본 수단으로 사용한다.<br>
이것은 어플리케이션과 패키지라고 하는 재사용 가능한 라이브러리를 만들기 위한 조립용 블록이다.</p>
<ul>
<li>작은 것이 아름답다.</li>
<li>각 프로그램이 각기 한 가지 역할을 잘 하도록 만든다.</li>
</ul>
<p>공식 패키지 관리자인 npm의 도움으로, Node.js는 설치된 각 패키지가 각기 고유한 별도의 일련의 의존성을 가지도록 함으로써, 프로그램 충돌 없이 많은 패키지들을 의존할 수 있다.<br>
따라서 모듈의 재사용성이 극도로 높으며, 재사용성이 높은 모듈들은 다음과 같은 강점을 가진다.</p>
<ul>
<li>이해하기 쉽고 사용하기 쉽다.</li>
<li>테스트 및 유지보수가 간단하다.</li>
<li>브라우저와 완벽한 공유가 가능하다.<br>
더 작고 집중된 모듈을 사용하면, 작은 코드 조각이라 해도 모두가 공유하거나 재사용할 수 있다. 우리는 이것을 <strong>DRY</strong>(Don’t Repeat Yourself) 라고 부른다.</li>
</ul>
<h3 id="작은-외부-인터페이스">작은 외부 인터페이스</h3>
<p>Node.js 모듈은 크기와 범위가 작을 뿐만 아니라 대개 최소한의 기능을 노출하는 특성을 가지고 있다. 여기서 가장 큰 이점은 API의 유용성이 향상된다는 점이다. 즉, API의 사용 방법이 보다 명확해지므로, 유스케이스를 줄이고, 구현을 단순화하며, 유지 관리를 용이하게 하고, 기용성을 높이는 장점이 있다.<br>
Node.js에서 모듈을 정의하는 일반적인 패턴은, 힘수나 생성자와 같이 <strong>하나의 핵심 기능</strong>을 표현하는 동시에, 더 많은 고급, 보조 기능은 함수나 생성자의 <strong>속성</strong>이 되도록 하여 명백한 단일 진입점을 제공한다.</p>
<h3 id="간결함과-실용주의">간결함과 실용주의</h3>
<p><strong>KISS</strong>(Keep It Simple, Stupid)원칙!<br>
<em>“단순함이야말로 궁극의 정교함이다.”</em><br>
부족하지만 단순한 기능이 소프트웨어에 있어서 더 좋은 디자인이라는 뜻이다.<br>
즉, <strong>단순함</strong>이 설계에 있어 가장 중요한 고려 사항이라는 것이다.</p>
<p>실제로 Node.js에서 이 단순함이라는 철학은 자바스크립트에 의해 가능하다.<br>
복잡한 객체 구조를 대체하는 간단한 함수, 클러조 및 객체 리터럴에 의해 이것이 가능해진다.  <strong>싱글톤</strong> 혹은 <strong>데코레이터</strong> 와 같은 상당수의 전통적인 디자인 패턴은 사소하고 완벽하지 않은 구현이라도 간단히 사용될 수 있으며, 복잡하지 않고 실용적인 접근법이 원칙적이고 완벽한 디자인보다 더 선호된다.</p>
<h2 id="node.js-6과-es2015">1.2 Node.js 6과 ES2015</h2>
<h3 id="let-const">let, const</h3>
<p>let 와 const를 사용하여 변수의 스코프와 라이프타임 및 가변성을 제시할 수 있다.<br>
중요한 것은 const가 할당된 값을 상수로 만드는 것이 아니라, <strong>바인딩된 값은 상수가 된다</strong>는 것이다.</p>
<pre><code>const x = {};
x.name = 'John';
</code></pre>
<p>객체 내부에서 속성을 변경하면 실제 값이 변경되지만, 변수와 객체 사이의 바인딩은 변하지 않으므로 이 코드는 오류를 발생시키지 않는다.<br>
반대로 <code>x = null</code> 처럼 전체 변수를 재할당하면, 변수와 값 사이의 바인딩이 변경되어 오류가 발생하게 된다.</p>
<h3 id="화살표-함수">화살표 함수</h3>
<p>화살표 함수의 스코프는, 어휘 범위(lexical scope)로 바인딩된다.</p>
<pre><code>function DelayedGreeter(name){
	this.name = name;
}
DelayedGreeter.prototype.greet = function(){
	setTimeout(function cb(){
		console.log('Hello ', this.name);
	},500);
};
const greeter = new DelayedGreeter('World');
greeter.greet(); //"Hello Undefined"
</code></pre>
<pre><code>function DelayedGreeter(name){
	this.name = name;
}
DelayedGreeter.prototype.greet = function(){
	setTimeout((function cb(){
		console.log('Hello ', this.name);
	}).bind(this),500);
};
const greeter = new DelayedGreeter('World');
greeter.greet(); //"Hello World"
</code></pre>
<p>화살표 함수는 어휘 범위에 바인딩되므로, 화살표 함수를 콜백 함수로 사용하면 이 문제를 해결할 수 있다.</p>
<pre><code>DelayedGreeter.prototype.greet = function(){
	setTimeout(()=&gt;console.log('Hello ',this.name), 500);
};
</code></pre>
<h3 id="클래스-구문">클래스 구문</h3>
<p>구문 상의 편의를 제공하기 위해, 구문을 클래스 형태로 명시적으로 기술할 수 있다. 여전히 클래스를 통하지 않고 프로토타입을 통해 속성과 함수를 상속하지만, 그저 <strong>명시적인 기능</strong>일 뿐이다.</p>
<pre><code>function Person(name, surname, age){
    this.name = name;
    this.surname = surname;
    this.age = age;
}

Person.prototype.getFullName = function(){
   return this.name + ' ' + this.surname;
};


Person.older = function(person1, person2){
   return (person1.age &gt;= person2.age) ? person1 : person2;
};
</code></pre>
<pre><code>class Person{
	constructor(name, surname, age){
		this.name = name;
		this.surname = surname;
		this.age = age;
	}
	getFullName(){
		return this.name + ' ' + this.surname;
	}
	static older(person1, person2){
		return (person1.age &gt;= person2.age) ? person1 : person2;
	}
}
</code></pre>
<p>function Person은 그 속성으로 name, surname, age과 두 가지 함수를 가진다.<br>
이를 클래스 형태로 바꾸면 아래처럼 이해하기 쉽게 표현할 수 있다.<br>
중요한 점은, 위처럼 클래스 형태로 선언하면 <strong>extend</strong>와 <strong>super</strong>키워드를 사용하여 프로토타입을 확장할 수 있다는 것이다. 이것은 클래스 기반의 언어들의 상속과 매우 유사하다.</p>
<pre><code>class PersonWithMiddnename extends Person{
	constructor (name, middlename, surname, age){
		super(name, surname, age);
		this,middlename = middlename;
	}
	getFullName(){
		return this.name + ' ' + this.middlename + ' ' + this.surname;
	}
}
</code></pre>
<p><strong>super</strong>를 통해 부모 생성자를 호출하는 새로운 생성자를 정의하였으며, getFullName 함수를 오버라이드하였다.</p>
<h3 id="향상된-객체-리터럴">향상된 객체 리터럴</h3>
<p>변수 및 함수를 객체의 멤버로 지정할 수 있고, 객체를 생성할 때 동적인 멤버명을 정의할 수 있도록 하며, 편리한 게터와 세터 함수들을 제공한다.</p>
<pre><code>const x = 22;
const y = 17;
const obj = { x. y };
</code></pre>
<p>함수를 가지는 객체를 만들 수 있다. <strong>function</strong> 키워드를 지정할 필요가 없다.</p>
<pre><code>module.exports = {
	square(x){
		return x* y;
	},
	cube(x){
		return x * x * x;
	}
};
</code></pre>
<p>객체의 멤버명을 동적으로 정의할 수 있다.</p>
<pre><code>const namespace = '-webkit-';
const style = {
	[namespace + 'box-sizing'] : 'border-box',
	[namespace + 'box-shadow']: '10px10px5px #888888'
};
// 결과 객체는 -webkit-box-sizing 과 -webkit-box-shadow 속성을 가지게 된다
</code></pre>
<p>게터와 세터를 정의할 수도 있다.</p>
<pre><code>const person = {
	name: 'George",
	surname: 'Boole',

	get fullname(){
		return this.name + ' ' + this.surname;
	},

	set fullname(fullname){
		let parts = fullname.split(' ');
		this.name = parts[0];
		this.surname = parts[1];
	}
};

console.log(person.fullname);//"George Boole"
console.log(person.fullname = 'Alan Turing');//"Alan Turing"
console.log(person.name); //"Alan"
</code></pre>
<h3 id="map-과-set-collection">Map 과 Set Collection</h3>
<pre><code>const profiles = new Map();
profiles.set('twitter', '@adalovelace');
profiles.set('facebook', 'adalovelace');
profiles.set('googleplus', 'ada');

profiles.size;//3
profiles.has('twitter');//true 
profile.get('twitter');//"@adalovelace"
profile.has('youtube'); //false
profiles.delete('facebook');
profile.has('facebook');//false
profile.get('facebook');//undefined
for (const entry of profiles){
	console.log(entry);
}
</code></pre>
<p>has, get, delete 메서드를 사용할 수 있다.<br>
for문을 사용하여 모든 원소들에 대해 구문을 적용할 수도 있다.<br>
<strong>함수와 객체를 Map의 키로 사용할 수 있다.</strong><br>
이 기능을 사용하여 정밀한 테스트 프레임워크를 만들 수도 있다.</p>
<pre><code>const tests = new Map();
tests.set(() =&gt; 2+2, 4);
tests.set(() =&gt; 2*2, 4);
tests.set(() =&gt; 2/2, 1);

for (const entry of tests) {
	console.log((entry[0]() === entry[1]) ? 'PASS' : 'FAIL');
}
</code></pre>
<p>함수를 키로, 예상값을 값으로 넣어두고 for문을 이용하면 유닛 테스트를 진행할 수 있다.<br>
<strong>일반 객체로 map을 구현했을 경우에 항상 순서가 유지되는 것이 아니다.</strong></p>
<p><strong>Set</strong> 프로토타입도 사용할 수 있다.<br>
map 프로토타입의 set메서드 대신 add메서드가 있다.</p>
<h3 id="weakmap-및-weakset-collection">WeakMap 및 WeakSet Collection</h3>
<p>인터페이스 측면에서 Map, Set과 유사하지만, 가지고 있는 요소 전체를 탐색할 수 있는 방법이 없으며, 객체만을 키로 가질 수 있다.<br>
WeakMap은 키로 사용된 객체에 대한 유일한 참조가 WeakMap 내에만 남아 있을 경우, 이 객체를 가비지 컬렉트 할 수 있다는 점이다.</p>
<pre><code>let obj = {};
const map = new WeakMap();
map.set(obj,{key:"some value"});
console.log(map.get(obj)); //{key: "some_value"}
obj = undefined; //map에 obj의 값에 대한 유일한 접근 방법인 obj가 사라졌으므로, 다음 가비지 컬렉트 사이클에서 맵에 관련된 데이터를 회수함
</code></pre>
<h3 id="template-표기법">Template 표기법</h3>
<p>백틱 기호를 사용해 문자열을 표기할 수 있다. 문자열 내에서 ${…}을 사용하여 변수 또는 표현식을 삽입할 수 있다.</p>
<pre><code>const name = "Leonardo";
const interests = ["arts", architecture", "science", "music", "mathmatics"];
const birth = { year : 1452, place : 'Florence'};
const text = `${name} was an Italian polymath
	interested in many topics such as
	${interests.join(', ')}. He was born
	in ${birth.year} in ${place}`
console.log(text);
</code></pre>
<h2 id="reactor-패턴">1.3 Reactor 패턴</h2>
<p>Node.js의 <strong>비동기 패턴</strong> 의 핵심인 <strong>Reactor</strong> 패턴 분석<br>
단일 스레드 아키텍쳐와 논 블로킹 I/O와 같은 패턴의 기본 개념 및 이것들이 Node 플랫폼 전체에 대한 기반을 형성하는 방법</p>
<h3 id="io는-속도가-느리다.">I/O는 속도가 느리다.</h3>
<p>I/O는 일반적으로 CPU측면에서 비용이 많이 들진 않지만, 요청을 보낸 순간부터 응답을 받는 순간까지 <strong>지연</strong>을 동반하게 된다. 게다가 인간이라는 요소도 고려해야 한다. 종종 APP에서의 입력은 채팅 메시지 전송 등 사용자의 입력에 기반하므로, I/O의 속도는 기술적인 면에만 의존하지는 않는다.</p>
<h3 id="블로킹-io">블로킹 I/O</h3>
<p>전통적인 블로킹 I/O 프로그래밍에서는 I/O 요청에 해당하는 함수 호출은, 작업이 완료될 때까지 스레드의 실행이 차단된다.</p>
<pre><code>//데이터를 사용할 수 있을 때까지 스레드는 다른 작업을 수행할 수 없음.
data = socket.read();
//data load가 완료된 후 데이터를 사용 가능함.
print(data);
</code></pre>
<p>블로킹 I/O를 사용하여 웹서버를 구현하면,  동일한 스레드에서 여러 연결을 처리할 수 없다<br>
각 소켓에서 클라이언트가 요청하는 모든 I/O요청이 다른 연결 처리를 차단할 것이다.<br>
이러한 이유로 웹 서버에서 동시성을 처리하기 위한 접근 방식은, 처리해야 하는 각각의 동시 연결에 대해 새로운 스레드, 혹은 프로세스를 시작하거나, 풀에서 가져온 스레드를 재사용하는 것이다.<br>
하지만 불행하게도 스레드를 많이 만드는 것은 시스템 리소스 측면에서 매우 비싸다.<br>
따라서 메모리를 소비하고 컨텍스트 전환을 유발하므로, 각 연결에 재해 재부분의 시간을 사용하지 않으면서 장시간 실행되는 스레드를 사용하는 것은 효율성 측면에서 최상의 절충안은 아니다.</p>
<h3 id="논-블로킹-io">논 블로킹 I/O</h3>
<p>시스템 호출은 데이터가 읽히거나 쓰여질 때 까지 기다리지 않고 항상 즉시 반환함. 호출하는 순간에 결과를 사용할 수 없을 가능성이 있음. 그런 경우 단순히 미리 정의된 상수를 반환하여 데이터를 사용할 수 없음을 나타냄.<br>
이런 종류의 논블로킹에 액세스하는 가장 기본적인 방법은 실제 데이터가 반환될 떄까지 루프 내의 리소르를 적극적으로 <strong>풀링</strong>하는 것이다. 이것을 <strong>busy-waiting</strong>이라고 부른다.</p>
<pre><code>resources = [socketA, socketB, pipeA];
while(!resources.isEmprt()){
	for(int i = 0 ; i &lt; resources.length ; i++){
		resource = resources[i];
		//읽기 시도
		let data - resource.read();
		if(data === NO_DATA_AVAILABLE)
			//당장 읽을 데이터가 없습니다.
			continue;
		if(data === RESOURCE_CLOSED)
			//데이터 리소스가 닫혔기 때문에, 리소스 목록에서 제거합니다
			resources.remove(i);
		else
			//데이터가 도착하여 이를 처리합니다.
			consumeData(data);
	}
}
</code></pre>
<p>위는 간단한 폴링 알고리즘의 예시이다. 위 예시에서 루프는 대부분의 경우 사용할 수 없는 리소스를 반복하는데만 CPU를 사용한다(데이터가 사용 가능한지 검사, 대부분의 경우 사용중이므로 의미 없는 루프의 반복)<br>
따라서, <strong>폴링 알고리즘은 대부분 엄청난 양의 시간 낭비를 초래함</strong></p>
<h3 id="이벤트-디멀티플렉싱">이벤트 디멀티플렉싱</h3>
<p>Busy-waiting은 논 블로킹 리소스를 처리하기 위한 이상적인 기술은 아니지만, 대부분의 OS들은 효율적인 논블로킹 리소스 처리를 위한 기본적인 메커니즘을 제공한다.<br>
이 메커니즘을 <strong>동기 이벤트 디멀티플렉서</strong> 또는 <strong>이벤트 통지 인터페이스</strong> 라고 합니다.<br>
<strong>감시</strong>된 일련의 리소스들로부터 들어오는 I/O 이벤트를 수집하여 큐에 넣고 처리할 수 있는 새 이벤트가 있을 때까지 차단합니다.<br>
다음은 두 개의 서로 다른 자원에서 읽기 위해 일반 동기 이벤트 디멀티플렉서를 사용하는 알고리즘의 의사코드이다.</p>
<pre><code>socketA, pipeB;
watchedList.add(socketA, FOR_READ); //[1]
watchedList.add(pipeB, FOR_READ);
while(events = demultiplexer.watch(watchedList)){ //[2]
	//이벤트 루프
	foreach(event is events){//[3]
		//여기서 read는 블록되지 않으며, 비어 있을지언정 **항상 데이터를 반환한다**
		data = event.resource.read();
		if(data === RESOURCE_CLOSED)
			//리소스가 닫혔기 때문에, 리소스 목록에서 제거합니다
			demultiplexer.unwatch(event.resource);
		else
			//실제 데이터가 도착하여 이를 처리함
			consume(data);
	}
}
</code></pre>
<p>알고리즘은 다음과 같다.<br>
[1] : 리소스를 데이터 구조에 추가한다.<br>
[2] : 이벤트 통지자에 감시할 리소스 그룹을 설정한다. 이 호출은 <strong>동기식</strong>이며, 감시 대상 자원 중 하나라도 읽을 준비가 될 때까지 차단됩니다. 이 경우, 이벤트 디멀티플렉서는 호출로부터 복귀하여 새로운 일련의 이벤트들을 처리할 수 있게 된다.<br>
[3] : 이벤트 디멀티플렉서에 의해 반환된 각 이벤트가 처리된다. 이 시점에서 각 이벤트와 관련된 리소스는 읽기 작업를 위한 준비가 되어 있으며, 차단되지 않는 상황이라는 것이 보증됩니다. 모든 이벤트가 처리되고 나면, 이 흐름은 다시 디멀티플렉서에서 처리 가능한 이벤트가 발생될 떄까지 차단된다.<br>
이를 <strong>이벤트 루프</strong>라고 한다.</p>
<p>이 패턴을 사용하면 <strong>Busy-waiting</strong> 기술을 사용하지 않고도 단일 스래드 내에서 여러 I/O 작업을 처리할 수 있다.</p>
<h3 id="reactor-패턴-소개">Reactor 패턴 소개</h3>
<p>Reactor패턴의 이면에는 각 I/O 작업과 관련된 핸들러(Node.js에서의 CallBack 함수로 표시됨)ㅇㄹ 갖는 것이다.<br>
이벤트가 생성되어 이벤트 루프테 의해 처리되는 즉시 호출(콜백 함수 호출)된다.</p>
<p>책 41 페이지 그림 참고</p>
<p><strong>비동기식 동작</strong>은 블로킹 없이 특정 시점에서 리소스에 액세스하는 요청을 표시하고, <strong>해당 처리가 완료되는 다른 시점</strong>에서 호출될 <strong>핸들러(콜백)</strong> 을 제공한다.</p>
<p>우리는 이제 Node.js의 핵심에 <strong>패턴</strong>을 정의할 수 있다.<br>
<strong>패턴</strong>은 일련의 관찰 대상 리소스에서 새 이벤트를 사용할 수 있을 때까지 <strong>차단</strong>하여 I/O를 처리한 다음, 각 이벤트를 관련 핸들러로 전달함으로써 반응한다</p>
<h3 id="node.js의-논-블로킹-엔진-libuv">Node.js의 논 블로킹 엔진 libuv</h3>
<p>각 OS에는 이벤트 디멀티플렉서에 대한 자체 인터페이스가 있다. 각 I/O작업은 동일한 OS내에서도 리소스 유형에 따라 매우 다르게 동작할 수 있다.<br>
또한 논 블로킹 동작을 위해 새로운 스레드를 만들어야 하는 Linux등의 운영체제도 있으므로, Node.js의 코어 팀은 <strong>libuv</strong>라는 C라이브러리를 제작하여 모든 주요 플랫폼과 호환되고, 서로 다른 유형의 리소스들의 논 블로킹 동작을 표준화 할 수 있는 것이다.</p>
<p>libuv는 기본 시스템 호출을 추상화하는 것 외에도, Reactor 패턴을 구혆고 있다. 따라서 이벤트 루프를 만들고 이벤트 큐를 관리하며, 비동기 입출력 자업을 실행하고 다른 유형의 작업을 큐에 담기 위한 API들을 제공한다.</p>
<h3 id="node.js를-위한-구조">Node.js를 위한 구조</h3>
<p>리액터 패턴과 libuv가 Node.js의 기본 구성 요소이지만, 전체 플랫폼을 구축하려면 다음 세 가지 구성 요소가 필요하다.</p>
<ul>
<li>libuv와 기타 로우 레벨의 기능들을 자바스크립트에 랩핑하고 사용 가능하도록 해주는 바인더</li>
<li>Chrome 의 V8 자바스크립트 엔진. 혁신적인 설계와 속도 그리고 효율적인 메모리 관리로 높은 평가를 받고 있습니다.</li>
<li>상위 수준의 Node.js API 를 구현하고 있는 코어 자바스크립트 라이브러리.</li>
</ul>
<h2 id="요약">1.4 요약</h2>
<p>Node.js에서 효율저이고 재사용 가능한 코드를 만들기 위한 토대를 제공한다.</p>
<ul>
<li>경량 코어, 경량 모듈</li>
<li>간결함과 실용주의</li>
<li>이벤트 디멀티플렉서와 libuv의 이벤트 루프를 활용한 비 동기식 논-블로킹 I/O</li>
<li>리액터 패턴<br>
리액터 패턴의 비동기 성질은 콜백과 시차를 두고 나중에 일어나는 작업들로 구성되는 다른 형태의 프로그래밍 스타일이 필요하다.</li>
<li>모듈 패턴과 단순성 및 최소화 원리는 재사용 가능성, 유지 보수 및 가용성 측면에서 새로운 방식의 시나리오를 가능하게 함.</li>
<li>많은 부분에서 프로그래밍의 근본으로 되돌아가거나, 크기나 복잡도 면에서 좀 더 인간적인 프로그래밍 방식 같은 <em>본질</em>로 인해 프로그래머들이 노드에 대한 관심을 놓지 않고 있다.</li>
<li>또한 ES2015의 도입으로 인해 모든 이점을 수용할 수 있는 새로운 방법을 제시하고 있다.</li>
</ul>


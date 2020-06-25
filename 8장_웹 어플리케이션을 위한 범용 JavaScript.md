---


---

<h1 id="장-웹-어플리케이션을-위한-범용-javascript">8장 웹 어플리케이션을 위한 범용 JavaScript</h1>
<p>자바스크립트의 플랫폼과 장치 전반에 걸친 가용성으로 인헤, 동일한 프로젝트의 여러 환경에서 재사용 가능한 코드의 개발이 주목받고 있다.<br>
Node.js에서 주목할 만한 사례는 서버(백엔드)와 클라이언트(프론트엔드) 사이에 코드를 공유하가 쉬운 웹 어플리케이션을 만들 수 있는 기회에 관한 것이다.<br>
코드 재사용을 위한 이 인식은 <strong>범용 자바스크립트</strong>(Universal JavaScript)로 불리고 있다.<br>
8장에서는 범용 자바스크립트에 대해 알아보고, 서버와 브라우저 간에 대부분의 코드를 공유할 수 있는 도구와 기법을 살표보자.<br>
특히 모듈을 서버 및 클라이언트에서 모두 사용하는 방법과 <strong>Webpack</strong> 및 <strong>Babel</strong>과 같은 도구를 사용하여 브라우저에 패키지를 패키징하는 법을 배울 것이다.<br>
또한 React라이브러리와 다른 모듈들을 사용해 웹 프론트엔드를 구축하고 웹 서버의 상태를 프론트엔드와 공유하고, 어플리케이션 내에서 범용 라우팅(universal routing) 및 범용 데이터 검색(universal data retrieval)을 가능하게 솔루션들에 대해 알아보자.<br>
마지막으로 React를 사용한 Single-Page Application(SPA)를 작성하여 일관성 있고 추론하기 쉬우며 유지하기 쉬운 어플리케이션을 만들어 보자.</p>
<h1 id="브라우저와-코드-공유하기">8.1 브라우저와 코드 공유하기</h1>
<p>크로스 플랫폼 코드를 개발할 때는 항상 신중하게 설계해야 한다.<br>
각 플랫폼에 없는 DOM, long-living뷰, 파일 시스템이나 프로세스 관리 등을 고려해야 하고, ES5와 ES2015 사이에서 적절한 타협점을 찾아야 한다.</p>
<h2 id="모듈-공유">8.1.1 모듈 공유</h2>
<p>노드와 브라우저 사이에서 코드를 공유할 때의 문제점은, 브라우저에서는 require()함수 또는 모듈을 해석할 수 있는 파일 시스템이 없기 때문이다.<br>
따라서 빌드 시 모든 종속성들을 함께 번들링하고 브라우저에서 require()메커니즘을 추상화하는데 도움을 줄 수 있는 도구가 필요하다.</p>
<h3 id="범용-모듈-정의">범용 모듈 정의</h3>
<p>노드에서는 CommonJS모듈이 컴포넌트 간의 종속성을 설정하기 위한 기본 매커니즘이다. 하지만 브라우저 공간은, 모듈 시스템이 전혀 없을 수도 있고, 비동기 모듈 정의 로더(Asynchronous Module Definition: AMD)기반의 환경이거나, CommonJS 모듈 시스템을 추상화한 환경을 가지고 있을 수 있다.</p>
<h2 id="es2015-모듈">8.1.2 ES2015 모듈</h2>
<p>내장 모듈 시스템을 사용할 수 있다.<br>
ES2016모듈의 목표는 CommonJS 및 AMD 모듈을 최대한 활용하는 것이다.<br>
즉, 압축된 구문과 단일 exports를 선호하며 종속성 순환 지원을 제공하고, AMD와 마찬가지로 비동기 로드 및 환경설정 가능한 모듈 로드를 직접 지원한다.<br>
또한 선언적 구문 덕분에 정적 분석기를 사용하여 정적 검사 및 최적화 같은 작업을 수행할 수 있다.</p>
<h1 id="webpack-소개">8.2 WebPack 소개</h1>
<p>WebPack을 이용하면, require()와 module.exports를 사용하여 작성한 모듈을 브라우저에서 쉽게 실행할 수 있는 번들로 변환할 수 있다.<br>
WebPack은 Node.js 모듈 규칙을 사용하여 모듈을 작성한 다음, 컴파일 단계에서 모듈이 브라우저에서 작업하는데 필요한 모든 종속성(require()함수의 추상화를 포함)을 포함하는 <strong>번들(단일 .js파일)</strong> 을 작성한다.<br>
그런 다음 번들을 웹에서 쉽게 불러오고 실행할 수 있다.</p>
<h2 id="webpack의-마력-탐구">8.2.1 WebPack의 마력 탐구</h2>
<p>수동으로 UMD등을 사용해 범용 모듈을 정의하지 않고도 범용 프로그램을 작성할 수 있다.</p>
<blockquote>
<p>npm install webpack -g<br>
npm install mustache</p>
</blockquote>
<pre><code># sayHello.js
var mustache = require('mustache');  
var template = '&lt;h1&gt;Hello &lt;i&gt;{{name}}&lt;/i&gt;&lt;/h1&gt;';  
mustache.parse(template);  
module.exports.sayHello = function(toWhom) {  
    return mustache.render(template, {name: toWhom});  
};

#main.js
window.addEventListener('load', function() {  
    var sayHello = require('./sayHello').sayHello;  
 var hello = sayHello('Browser!');  
 var body = document.getElementsByTagName("body")[0];  
  body.innerHTML = hello;  
});
</code></pre>
<blockquote>
<p>webpack main.js</p>
</blockquote>
<p>webpack이 재귀적으로 소스를 스캔하고 require() 함수의 참조를 찾아 resolve한 다음 번들에 포함시킨다.</p>
<pre><code>#magic.html
&lt;html&gt;  
&lt;head&gt;  
&lt;title&gt;Webpack magic&lt;/title&gt;  
&lt;script src="bundle.js"&gt;&lt;/script&gt;  
  &lt;/head&gt;  
  &lt;body&gt;  
  &lt;/body&gt;  
&lt;/html&gt;
</code></pre>
<h2 id="webpack-사용의-이점">8.2.2 WebPack 사용의 이점</h2>
<ol>
<li>
<p>Webpack은 브라우저와 호환되는 https, clam, events 등의 Node.js 코어 모듈용 버전을 자동으로 제공한다.</p>
</li>
<li>
<p>브라우저와 호환되지 않는 모듈이 있는 경우, 이를 빌드에서 제외하거나 빈 객체나 <strong>다른 모듈로 대체</strong>하거나 브라우저와 호환 구현을 제공하는 다른 모듈로 <strong>바꿀</strong>수 있다.</p>
</li>
<li>
<p>다른 모듈에 대한 번들을 생성할 수 있다.</p>
</li>
<li>
<p>서드파티 <strong>로더</strong>와 <strong>플러그인</strong>을 사용하여 소스 파일의 추가적인 처리를 가능하게 한다. CoffeeScript, TypeScript 또는 ES2015부터 시작하여 AMD로더를 지원하기 위해 require()를 사용하는 Bower패키지에 이르기까지, 또 최소화에서 템플릿과 CSS 스타일시트같은 다른 리소스들의 컴파일과 번들링에 이르기까지 필요한 거의 모든 로더와 플러그인이 존재한다.</p>
</li>
<li>
<p>Guip 및 Gunit 와 같은 작업 관리자에서 Webpack을 쉽게 호출할 수 있다.</p>
</li>
<li>
<p>Webpack을 사용하면 JavaScript 파일뿐 아니라 스타일시트, 이미지, 폰트 및 템플릿과 같은 모든 프로젝트 리소스를 관리하고 전처리 할 수 있다.</p>
</li>
<li>
<p>종속 트리를 분할하여 브라우저에서 필요할 때마다 로드할 수 있도록 Webpack을 구성할 수도 있다.</p>
</li>
</ol>
<h2 id="webpack과-함께-es2015-사용하기">8.2.3 Webpack과 함께 ES2015 사용하기</h2>
<p>Webpack은 로더와 플러그인을 사용하여 소스코드를 번들링하기 전에 변환할 수 있다.</p>
<p>Webpack의 로더 기능을 활용해 소스 모듈에서 ES2015구문을 사용하여 예제를  작성해보자.</p>
<p>적절한 환경설정의 사용을 통해 Webpack은 결과 코드를 ES5문법으로 변환한다.</p>
<h1 id="크로스-플랫폼-개발의-기본">8.3 크로스 플랫폼 개발의 기본</h1>
<p>크로스 플랫폼으로 개발할 때 직면하는 가장 일반적인 문제는 플랫폼에 종속적인 세부 사항들에 대해 서로 다른 구현을 제공하면서 컴포넌트의 공통적인 부분을 공유하는 것이다.</p>
<p>이를 다루는 원칙과 패턴을 파악하자.</p>
<h2 id="런타임-코드-분기">8.3.1 런타임 코드 분기</h2>
<p>코드를 통해 동적으로 분기하는 것이 직관적으로 호스트의 플랫폼에 때라 다양한 구현을 제공하는 방식일 것이다.<br>
이를 위해 런타임에 호스트의 플랫홈을 인식한 우 if…else로 분기 처리하는 매커니즘이 필요하다.<br>
일반적인 방식으로 Node.js에서만 사용 가능한 <strong>global</strong>을 인식한다거나, <strong>window</strong>의 존재 여부를 확인하는 등이다.</p>
<pre><code>if(typeof window !== "undefined" &amp;&amp; window.document){
	//클라이언트(브라우저) 측 코드
	console.log('Hey Browser!');
}else {
	//Node.js 측 코드
	console.log('Hey Node.js!');
}
</code></pre>
<p>이렇게 런타임 분기를 사용할 경우 직관적이긴 하지만 몇 가지 문제가 있다.</p>
<ul>
<li>
<p>다른 플랫폼들의 코드를 모두 동일한 모듈에 포함시키므로, 코드가 매우 길어질 수 있다.</p>
</li>
<li>
<p>비즈니스 로직이 플랫폼 간 호환성을 위해 추가한 로직과 섞여 코드의 가독성을 떨어뜨릴 수 있다.</p>
</li>
<li>
<p>동적 분기를 사용하여 플랫폼에 따라 다른 모듈을 로드하면 대상 플랫폼과 상관없이 모든 모듈이 최종 번들에 추가된다.</p>
</li>
</ul>
<h2 id="빌드-타임-코드-분기">8.3.2 빌드 타임 코드 분기</h2>
<p>Webpack에서 가벼운 번들 파일을 위해, 빌드할 때 서버에서만 사용할 코드의 모든 부분을 제거하는 방법을 보자.</p>
<p>로더(Rules)외에도 Webpack은 플러그인 지원을 제공하므로, 번들 파일을 작성하는 데 사용되는 프로세스 파이프라인을 확장할 수 있다. 빌드 시 코드 분기(브랜칭)을 수행하기 위해서는 두 개의 내장된 플러그인으로 DefinePlugin과 UglifyJsPlugin이라는 파이프라인을 사용할 수 있다.</p>
<p>DefinePlugin은 사용자 정의 코드 또는 변수로 소스 파일의 특정 코드 항목을 대처하는데 사용할 수 있다.<br>
UglifyJsPlugin은 결과 코드를 압축하고 도달하지 않는 문장을 제거할 수 있다.</p>
<p>다만 이 기술들을 남용한다면, 여전히 소스코드를 복잡하게 만들 수 있다.<br>
또한 브라우저에서 실행될 어플리케이션의 전체 코드에 걸쳐서 서버 코드에서 분기하는 문장을 항상 작성해야 하기 때문에 이 또한 바람직하지 않다.</p>
<h2 id="모듈-교환module-swapping">8.3.3 모듈 교환(module swapping)</h2>
<p>대부분의 경우 빌드 타임에 클라이언트에 포함할 코드와 아닌 코드들을 구분할 수 있으므로, 이 결정을 우리가 미리 번들러에게 알릴 수 있음을 의미한다. 이렇게 하면 불필요한 모듈 및 분기문 등을 제외할 수 있으므로, 더 가독성 있는 코드가 된다.<br>
Webpack으로 모듈 교환을 적용해 보자.<br>
우선 각각에 맞는 코드를 작성한 후, webpack.config.js에서 NormalModuleReplacementPlugin을 사용할 수 있다. 첫 번째 인자로는 정규 표현식을, 두 번째 인자는 리소스에 대한 경로를 나타내는 문자열이다.<br>
빌드 시에 리소스가 주어진 정규식과 일치하면 두 번째에서 제공된 리소스로 대체된다.</p>
<p>npm에서 가져온 외부 모듈에도 동일한 교체 기술을 사용할 수 있다.</p>
<h2 id="크로스-플랫폼-개발을-위한-디자인-패턴">8.3.4 크로스 플랫폼 개발을 위한 디자인 패턴</h2>
<p>우리의 디자인에 어떻게 이들을 통합하는가?</p>
<ol>
<li>
<p>전략(Strategy)과 템플릿(Template) : 알고리즘의 공통 단계를 정의하고 나머지를 교체할 수 있게 하므로, 런타임 혹은 컴파일 분기를 통해 플랫폼별 부품이 다른 전략이나 템플릿 메소드를 사용하도록 변경할 수 있다.</p>
</li>
<li>
<p>어댑터: 컴포넌트 전체를 교체할 때 유리하다. 브라우저와 호환되지 않는 전체 모듈을 브라우저 호환 인터페이스 위에 구축된 어뎁터(LevelUP)으로 구현해본 적이 있다.</p>
</li>
<li>
<p>프록시: 서버에서 실행되도록 한 코드를 브라우저에서 실행할 때, 명령과 반환값을 교환하도록 서버에 상주하는 모듈(fs 등)에 대한 모든 요청을 프록시하는 객체를 클라이언트에 생성하는 것을 생각해볼 수 있다.</p>
</li>
<li>
<p>옵저버: 이벤트를 발생시키는 컴포넌트와 이벤트를 수신하는 컴포넌트 사이의 추상화를 제공한다. 하나의 이벤트를 공유하는 플랫폼 별의 구현체를 리스너와 emitter에 맞게 구현할 수 있다.</p>
</li>
<li>
<p>DI 및 서비스 로케이터: DI와 서비스 로케이터는 모두 주입 순간의 모듈에 구현을 대체하는데 유용하게 사용할 수 있다.</p>
</li>
</ol>
<h1 id="리액트react-소개">8.4 리액트(React) 소개</h1>
<p>React는 컴포넌트의 개념에 초점을 맞추어 뷰의 추상화를 제공한다.<br>
여기서 컴포넌트란 버튼, HTML의 div 등 간단한 컨테이너이다.<br>
이 개념은 특정한 책임을 가진, 고도로 <strong>재사용 가능한</strong> 컴포넌트를 정의하고 구성하는 것만으로 어플리케이션의 사용자 인터페이스를 구축할 수 있어야 한다는 것이다.<br>
React는 설계 상 DOM에 바인딩되어 있지 않다. 따라서 다른 영역에서도 사용 가능하며, 대표적인 예시가 React-Native다.</p>
<p>React가 범용 JS개발과 관련해 매우 흥미로운 주된 이유는, 동일한 코드로 서버와 클라이언트 모두에서 뷰 코드를 렌더링할 수 있기 때문이다.<br>
즉, React를 사용하여 사용자가 Node.js서버에서 직접 요청한 페이지를 표시하는 데 필요한 모든 HTML코드를 렌더링한 후 페이지가 로드될 때 추가적인 상호 작용이나 렌더링을 브라우저에서 직접 수행할 수 있다.</p>
<p>이를 통해 대부분의 작업이 브라우저에서 이루어지고 변경해야 할 페이지의 일부만 새로 고쳐지는 SPA(Single-PageApplications)을 구축할 수 있다. 동시에 사용자가 로드하는 첫 번째 페이지를 서버에서 제공함으로써 로딩 시간이 단축되고 검색 엔진의 콘텐츠 색인 기능이 향상된다.</p>


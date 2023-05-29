---
category:
  - 编程
tag:
  - java
date: 2023-05-27
---

# 十分钟看懂协变和逆变

variance，中文一般翻译为型变或者变体，是编程领域一个很容易犯错的点，也是一个有点不那么直观的点。我之前对这个概念也是似懂非懂的，所以这次特地在网上翻了不少资料，好好的研究了一下这个问题，顺便写篇博客介绍一下，假如以后忘了也能很快的想起来。

话说其实我现在已经很少写技术博客了，也是自己懈怠了，没有好好研究技术，一些重要的内容该写还是得写啊。

这里就用咱们民工最爱的 Java 来作为主要语言，来简单的探讨一下这个问题。

## 基础

首先我们来创建一些类关系作为演示。示例很简单，我们先创建了动物、猫、狗这几个具有继承关系的类，然后定义了一个泛型类商人，用来买卖这几种动物。

```java
class Animal {
}

class Dog extends Animal {
}

class Cat extends Animal {
}

class Businessman<T> {
    private final Stack<T> inventory = new Stack<>();

    public Businessman() {
    }

    public Businessman(Iterable<T> iter) {
        for (T e : iter) {
            inventory.push(e);
        }
    }

    public void buy(T t) {
        inventory.push(t);
    }

    public T sell() {
        return inventory.pop();
    }
}
```

如此一来，我们就能编写以下代码，用动物商人来买卖动物，用猫商人来买卖猫，一切都是这么完美。

```java
Businessman<Animal> animalBusinessman = new Businessman<>();
animalBusinessman.buy(new Animal());
Animal animal = animalBusinessman.sell();

Businessman<Cat> catBusinessman = new Businessman<>();
catBusinessman.buy(new Cat());
Cat cat = catBusinessman.sell();
```

然而，有聪明人就开始思考，如果我们现在需要买一些动物，但是附近只有一个猫商人，那么我们能不能把这个猫商人当成动物商人，向他买动物呢？反过来，如果我们现在手上有些猫想要卖给猫商人，但只有一个动物商人，我们能不能把猫卖给他呢？这两个问题，就引出了本文的主题，协变和逆变，好了，让我们继续往下看吧。

## 协变和逆变

### 协变

首先，我们先来讨论一下第一个问题，一个猫商人能不能像动物商人一样卖动物呢？理论上应该是可以的，因为猫显然就属于动物，那么一个猫商人当然可以把猫当作动物来卖。但是当我们把这个逻辑写成 Java 代码的时候，编译器却报了错误，这是怎么回事呢？因为编译器比较严格，虽然动物和猫之间有继承关系，但是动物商人和猫商人之间却并没有继承关系，所以这个替换就会失败。

```java
Businessman<Animal> businessman = new Businessman<Cat>(List.of(new Cat(), new Cat()));
Animal animal = businessman.sell();
```

大家应该都听说过面向对象编程中有一个*里氏替换原则*的概念吧，它说的是，如果一个类型系统设计正确的话，在父类型出现的地方，应该可以用子类型来替换。然而`Businessman`这个类是一个泛型类，并不符合里氏替换原则，所以编译器不认为猫商人和动物商人之间有子类型关系，所以就会有上面的报错。

要解决这个问题，就要用到协变了。在 java 中需要使用`<? extends Animal>`这个看起来有点奇怪的语法，问号表示任意类型，加上`extends`表达式，意思就是说这个类型不确定，我们只知道它是`Animal`或者任何`Animal`的子类型。

这样一来，我们的问题就解决了，现在我们可以将一个猫商人当作动物商人，然后再向他买动物了。

```java
Businessman<? extends Animal> businessman = new Businessman<Cat>(List.of(new Cat(), new Cat()));
Animal animal = businessman.sell();
```

本来，`Businessman<Animal>`和`Businessman<Cat>`之间并不存在子类型关系，但是通过一番操作，我们让他们之间具有了子类型关系，而且这个子类型关系和他们的泛型参数（`Animal`和`Cat`）是一致的，这种情况就叫做**协变**（covariance）。

我们在看看第二行，一个动物商人可以卖动物，实际上他卖的动物更加具体（猫），这是符合里氏替换原则的。

### 协变的限制

协变的概念很好用，但是也有一些限制。

还是这个被当做动物商人的猫商人，我们现在不向他买东西了，而是要卖东西给他。然而，我们发现，不管向这个商人卖什么东西，编译器都会报错，这又是怎么回事呢？

```java
Businessman<? extends Animal> businessman = new Businessman<Cat>(List.of(new Cat(), new Cat()));
Animal animal = businessman.sell();
// 这个商人什么也买不了
businessman.buy(new Animal());
```

原因其实也很简单，因为我们的需求比较特殊。当我们把一个猫商人当作动物商人的时候，他虽然可以随意卖出动物（因为他的猫都是动物），但是他实际上已经丧失了购买任何商品的能力。因为他现在的身份是一个动物商人，理论上可以购买任意动物，但是他并不能真的去购买一只狗或者是什么别的动物，因为他的真实身份是一个猫商人，只能接受猫！

换一种说法就是，这个支持协变的“动物商人”，现在只有卖动物的能力了，也就是说，他是一个**生产者**，只能向外界生产商品。

### 逆变

好了，让我们再考虑一下第二个问题，当我们需要把一些猫卖给猫商人的时候，能不能用找个动物商人来卖呢？理论上应该也是可以的，因为一个动物商人当然可以收各种各样的动物，我们手上的是猫，应该可以卖给动物商人。但是如果写成 java 代码的话，一样会报错。

```java
Cat catForSale = new Cat();
Businessman<Cat> catBusinessman = new Businessman<Animal>();
catBusinessman.buy(catForSale);
```

有了上面的经验，我们知道，编译器认为这两个是不同的类型，所以不能随便替换，解决办法自然也是有的。需要使用`<? super Cat>`这个看起来更奇怪的声明，它的意思是，这个泛型类型可以是任意类型，只要是`Cat`的父类型就行，和之前的`extends`正好相反。这样，这个商人就可以安心收购猫了。

```java
Cat catForSale = new Cat();
Businessman<? super Cat> catBusinessman = new Businessman<Animal>();
catBusinessman.buy(catForSale);
```

同时，我们也可以发现一个很有意思的点。现在我们用把动物商人当作猫商人，让他来收购猫，也就是说`Businessman<Cat>`和`Businessman<Animal>`也存在了一个子类型关系，但是这个子类型关系正好和他们的泛型参数（`Cat`和`Animal`）相反。所以这种情况就叫做**逆变**（contravariance）。

逆变其实也没有违反里氏替换原则，因为这个时候我们让动物商人买猫，同样是用子类型（猫）去替换父类型（动物商人只收动物）。和上面的协变相比，我们会发现逆变发生在函数的参数上，而协变发生在函数的返回值上。

### 逆变的限制

逆变同样具有一些限制。

如果我们向这个被当做猫商人的动物商人买东西的话，会发生什么事情呢？答案是，只能得到`Object`。他的真实身份是动物商人，但是当他被拉过来作为猫商人的时候，他虽然获得了收购猫的能力，但是代价则是`<? super Cat>`的约定，也就是说他的货可以是所有”东西“（而不仅仅是动物），于是我们能得到的，也只有”东西“而已。

```java
Cat catForSale = new Cat();
Businessman<? super Cat> catBusinessman = new Businessman<Animal>();
catBusinessman.buy(catForSale);
// 这个商人只能卖出去东西
Object c = catBusinessman.sell();
```

换种说法就是，这个真实身份是动物商人的猫商人，只能买东西，也就是说，他是一个**消费者**。

虽然他其实也可以卖东西，但是卖的货只是`Object`，而我们使用泛型，正是要避免`Object`类型，所以这时候卖东西这个操作并没有什么意义，反正我们也只需要他买东西。

### 不变

现在我们已经了解了型变的一些知识了。我们知道，默认情况下，`Businessman<Cat>`和`Businessman<Animal>`是不能替换使用的，他们之间并没有子类型关系。这种情况也有一个名词，叫做不变（invariance）。不变的好处就是安全，一个动物商人可以随心所欲的买卖动物，一个猫商人也可以随心所欲的买卖猫。

不过不变有时候不够灵活，所以如果我们只需要买一些动物，我们是可以去找一个猫商人买的，因为猫商人卖猫也是符合我们的需求的。但是这样一来，这个商人就没办法买东西了，因为这会打破我们之间的约定。这就是协变。

对应的，如果我们想要卖一些猫的话，我们可以直接去找一个动物商人，因为动物商人收任何动物，这其中当然也包括猫，这也是符合我们的需求的。但是这样一来，这个商人就只能买猫而不能卖猫了，因为他卖东西同样会打破我们之间的约定。这就是逆变。

### 数组的协变

上面介绍了 java 泛型类中协变和逆变的例子，大家应该也都看明白了。其实除此以外，java 在其它一些地方也支持协变或者是逆变。我们来简单说明一下。

首先是数组，java 的数组是支持协变的，这意味着`Dog`类型数组是`Animal`类型数组的子类型，所以下面的代码可以通过编译。

```java
Animal[] animals = new Dog[3];
animals[0] = new Dog();
animals[1] = new Dog();
animals[2] = new Cat();
```

以上代码可以通过编译的，但是在运行的时候会抛出`ArrayStoreException`。仔细研究一下就会发现，问题出在最后一行上。这时候我们操作的对象是 Animal 数组，我们理所应当的认为应该可以将任意 Animal 对象添加到数组中，但是这其实是不可行的，因为底层的数组实际上是 Dog 类型的，所以我们并不能将 Cat 添加到数组中，程序执行到此处就会抛出异常。

Java 的数组支持协变，但是并不安全，因为向数组中添加不恰当的元素（比如试图在一群狗中加一只猫）就会在运行时抛出异常。

这其实涉及到了另外一个问题，可变（mutable）和不可变（immutable）。如果一个集合是可变的，那么在这个集合创建之后，我们可以继续对它的元素进行增删查改。反之，如果一个集合是不可变的，那么在创建它之后，它就是只读的状态，我们无法对它进行更改。在一些编程语言中同时存在 mutable 集合和 immutable 集合，所以我们知道，在这些 immutable 集合上使用协变是非常安全的。

### 集合的不变性

下面我们来看看 Java 标准库里的集合是如何处理型变的。不出所料，以下代码无法通过编译，也就是说 java 中的集合是不变（invariant）的。

```java
// 这行代码无法编译
List<Animal> animals = new ArrayList<Cat>();
```

### 集合的协变

要在集合中使用协变，同样需要`extends`语法。这样我们就可以安全的把一群猫当作一群动物了。需要注意的是，这个时候这群动物的身份是生产者，我们可以读他的元素，但是没办法添加或者修改他的元素，即**这个协变集合是只读的**。

```java
List<? extends Animal> animals = List.of(new Cat(), new Cat());
Animal animal1 = animals.get(0);
// 会报错，只能读不能写
animals.add(new Cat());
```

当然这个*只读*也只是限制泛型参数的使用而已，我们仍然可以对集合调用`clear()`方法来清空集合，因为这个方法没有附带任何泛型参数。

### 集合的逆变

和协变相反，对一个集合使用逆变，意味着它是一个消费者，即**只能写不能读**。如果要强行读取的话，只能得到`Object`类型。

```java
List<? super Cat> cats = new ArrayList<Animal>();
cats.add(new Cat());
cats.add(new Cat());
Object o = cats.get(0);
```

所以有大佬总结出了一个 PECS 原则，即 producer-extends, consumer-super，生产者使用`extends`关键字，消费者使用`super`关键字。

而在 Java 标准库中有一个方法，完美的诠释了 PECS 原则，这就是`java.util.Collections`类中的`copy`方法，源代码如下。可以看到，这个方法的作用是复制集合，在参数中使用了两种泛型声明，这样一来，我们就可以非常灵活的复制集合了。例如，我们可以将`List<PetDog>`复制到`List<Object>`中。

```java
    public static <T> void copy(List<? super T> dest, List<? extends T> src) {
        int srcSize = src.size();
        if (srcSize > dest.size())
            throw new IndexOutOfBoundsException("Source does not fit in dest");

        if (srcSize < COPY_THRESHOLD ||
            (src instanceof RandomAccess && dest instanceof RandomAccess)) {
            for (int i=0; i<srcSize; i++)
                dest.set(i, src.get(i));
        } else {
            ListIterator<? super T> di=dest.listIterator();
            ListIterator<? extends T> si=src.listIterator();
            for (int i=0; i<srcSize; i++) {
                di.next();
                di.set(si.next());
            }
        }
    }
```

## 总结

好了，现在大家应该已经完全搞明白型变这个概念了吧。最后就用稍微正规一点的语言来描述一下：

> 如果 A 是 B 的子类型，那么就记作 `A <= B`。如果 T 是一个泛型而 U 是它的参数，那么就记作 `T<U>`。
>
> 如果对于`A <= B`，有`T<A> <= T<B>`，那么就叫做协变；
>
> 如果对于`A <= B`，有`T<A> => T<B>`，那么就叫做逆变；
>
> 如果对于`A <= B`，既没有协变也没有逆变， 那么就叫做不变。

在 java 中，协变使用`<? extends T>`声明，表示任意 T 或者 T 的子类型，`extends`限定了泛型参数的父类型，所以也叫做上界限定符。逆变使用`<? super T>`声明，表示任意 T 或者 T 的父类型，`super`关键字限定了泛型参数的子类型，所以也叫做子类型限定符。

通常情况下，协变参数出现在函数返回值的位置，可以返回更加具体的类型；而逆变参数则出现在函数参数的位置，可以接受更加宽泛的类型。

以上就是关于型变的一些介绍了，过段时间我还会补充一下别的语言中的泛型和型变，他们也蛮有意思的。

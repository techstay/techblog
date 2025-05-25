---
category:
  - programming
tag:
  - java
date: 2025-05-07
---

# Understanding Covariance and Contravariance in Ten Minutes

Variance is a concept in programming that is prone to mistakes. I used to have only a vague understanding of it, so this time I specifically looked up a lot of information online to thoroughly study the issue. I also took the opportunity to write a blog post introducing it, so that if I forget in the future, I can quickly recall it.

Here, we'll use the classic Java as the primary language to briefly explore this issue.

## Basic

First, let's create some class relationships for demonstration. The example is quite simple: we'll start by creating the classes Animal, Cat, and Dog, which have an inheritance relationship. Then, we'll define a generic class Merchant to buy and sell these types of animals.

```java
class Animal {
}

class Dog extends Animal {
}

class Cat extends Animal {
}

class Merchant<T> {
  public final Deque<T> inventory;

  public Merchant() {
    this.inventory = new ArrayDeque<>();
  }

  public Merchant(Collection<T> collection) {
    this.inventory = new ArrayDeque<>(collection);
  }

  public void buy(T t) {
    inventory.push(t);
  }

  public T sell() {
    return inventory.pop();
  }
}

```

In this way, we can write the following code: use an animal merchant to buy and sell animals, and use a cat merchant to buy and sell cats. Everything is just so perfect.

```java
Merchant<Animal> animalMerchant = new Merchant<>();
animalMerchant.buy(new Animal());
Animal animal = animalMerchant.sell();

Merchant<Cat> catMerchant = new Merchant<>();
catMerchant.buy(new Cat());
Cat cat = catMerchant.sell();
```

Let's think about this: if we now need to buy some animals, but there is only a cat merchant nearby, can we treat this cat merchant as an animal merchant and buy animals from him? Conversely, if we currently have some cats we want to sell to a cat merchant, but there is only an animal merchant, can we treat this animal merchant as a cat merchant and sell the cats to him? These two questions lead us to the main topic of this article: covariance and contravariance. Alright, let's continue reading.

## Covariance and Contravariance

### Covariance

First, let's discuss the first question: Can a cat merchant sell animals like an animal merchant? Theoretically, it should be possible, because cats are clearly a type of animal, so a cat merchant can certainly sell cats as animals. However, when we translate this logic into Java code, the compiler throws an error. Why is that? Because the compiler is very strict—even though there is an inheritance relationship between animals and cats, there is no inheritance relationship between animal merchants and cat merchants, so this assignment will fail.

```java
// failed
Merchant<Animal> Merchant = new Merchant<Cat>(List.of(new Cat(), new Cat()));
Animal animal = Merchant.sell();
```

You've probably all heard of the _Liskov Substitution Principle_ in object-oriented programming, which states that if a type system is designed correctly, a subtype should be able to replace its parent type wherever the parent type appears. However, the `Merchant` class is a generic class, and only `Animal` and `Cat` have an inheritance relationship, which doesn't comply with the Liskov Substitution Principle. Therefore, the compiler doesn't consider the cat merchant and the animal merchant to have a subtype relationship, leading to the error mentioned above.

To solve this problem, we need to use covariance. In Java, this requires the somewhat peculiar syntax `<? extends Animal>`. The question mark represents any type, and with the `extends` expression, it means the type is uncertain—we only know it's either `Animal` or any subtype of `Animal`.

This way, our problem is solved. Now, we can treat a cat merchant as an animal merchant and then buy animals from him.

```java
// success
Merchant<? extends Animal> Merchant = new Merchant<Cat>(List.of(new Cat(), new Cat()));
Animal animal = Merchant.sell();
```

Originally, there was no subtype relationship between `Merchant<Animal>` and `Merchant<Cat>`, but through some manipulation, we established a subtype relationship between them, and this subtype relationship aligns with their generic parameters (`Animal` and `Cat`). This situation is called **covariance**.

Let’s look at the second line of code above. An animal merchant can sell animals, but in reality, the animals it sells are more specific (cats). This complies with the Liskov Substitution Principle.

### Limitations of Covariance

The concept of covariance is quite useful, but it also has some limitations.

Take this cat merchant who is treated as an animal merchant. Now, instead of buying from him, we want to sell something to him. However, we find that no matter what we try to sell to this merchant, the compiler reports an error. What’s going on here?

```java
Merchant<? extends Animal> Merchant = new Merchant<Cat>(List.of(new Cat(), new Cat()));
Animal animal = Merchant.sell();
// The merchant can buy nothing
// Merchant.buy(new Animal());
```

The reason is actually quite simple: our requirements are somewhat special. When we treat a cat merchant as an animal merchant, although they can freely sell animals (since all their cats are animals), they actually lose the ability to purchase any goods. This is because their current identity is that of an animal merchant, nominally able to buy any animal, but in reality, they can only buy cats. If they attempt to buy other animals like dogs, errors will occur. To prevent such errors, the compiler outright prohibits them from purchasing any animals—meaning even if they want to buy cats, they can't.

Put another way, this covariant-supporting "animal merchant" now only has the ability to sell animals. In other words, they are a **producer**, capable only of supplying goods to the outside world.

### Contravariance

Now, let’s consider the second question: when we need to sell some cats to a cat merchant, can we use an animal merchant to do so? Theoretically, this should also be possible, since an animal merchant can, of course, accept all kinds of animals. What we have are cats, which should be sellable to an animal merchant. However, if written in Java code, it would still throw an error.

```java
Cat catForSale = new Cat();
// failed
Merchant<Cat> catMerchant = new Merchant<Animal>();
catMerchant.buy(catForSale);
```

With the above experience, we know that the compiler considers these two as different types, so they cannot be arbitrarily substituted. Naturally, there is a solution. We need to use the seemingly even stranger declaration `<? super Cat>`, which means this generic type can be any type as long as it is a supertype of `Cat`, the exact opposite of the previous `extends`. This way, the merchant can safely purchase cats.

```java
Cat catForSale = new Cat();
Merchant<? super Cat> catMerchant = new Merchant<Animal>();
catMerchant.buy(catForSale);
```

Meanwhile, we can also observe an interesting point. Now we're using the animal merchant as a cat merchant to buy cats, meaning there's also a subtype relationship between `Merchant<Cat>` and `Merchant<Animal>`, but this subtype relationship is exactly the opposite of their generic parameters (`Cat` and `Animal`). Therefore, this situation is called **contravariance**.

Contravariance doesn't actually violate the Liskov Substitution Principle, because in this case, we're having the animal merchant buy cats, which still involves using a subtype (cat) to replace the parent type (the animal merchant only accepts animals). Compared to the covariance mentioned earlier, we'll find that contravariance occurs in function parameters, while covariance occurs in function return values.

### Limitations of Contravariance

Contravariance also comes with some limitations.

If we try to buy something from this animal merchant who's being treated as a cat merchant, what would happen? The answer is, we can only get `Object`. His true identity is an animal merchant, but when he's brought in as a cat merchant, while he gains the ability to buy cats, the trade-off is the `<? super Cat>` constraint, meaning his goods could be any "thing" (not just animals), so all we can obtain is just a "thing."

```java
Cat catForSale = new Cat();
Merchant<? super Cat> catMerchant = new Merchant<Animal>();
catMerchant.buy(catForSale);
// This merchant can only sell things.
Object c = catMerchant.sell();
```

In other words, this cat merchant, whose true identity is an animal merchant, can only buy things—meaning he is a **consumer**.

Although he could technically sell items, the goods he sells are only of type `Object`. Since we use generics precisely to avoid the `Object` type, the selling operation is meaningless in this context. After all, we only need him to buy things.

### Invariance

Now that we’ve learned some basics about variance, we know that by default, `Merchant<Cat>` and `Merchant<Animal>` cannot be used interchangeably—they have no subtype relationship. This scenario also has a term: **invariance**. The advantage of invariance is safety. An animal merchant can freely buy and sell animals, and a cat merchant can freely buy and sell cats.

However, invariance can sometimes be too rigid. If we only need to buy some animals, we can go to a cat merchant, since a cat merchant selling cats still meets our needs. But in this case, the merchant can no longer sell things, as that would break our agreement. This is **covariance**.

Conversely, if we want to sell some cats, we can directly approach an animal merchant, since an animal merchant accepts any animal—including cats—which also aligns with our needs. But then, this merchant can only buy cats and not sell them, because selling would again violate our agreement. This is **contravariance**.

These three concepts together are called **variance**.

### Covariance in Arrays

The examples above illustrate covariance and contravariance in Java’s generic classes, which should now be clear. Beyond generics, Java also supports covariance or contravariance in other areas. Let’s briefly discuss one.

First, arrays in Java support covariance. This means an array of type `Dog` is a subtype of an array of type `Animal`, so the following code compiles successfully.

```java
Animal[] animals = new Dog[3];
animals[0] = new Dog();
animals[1] = new Dog();
// failed
animals[2] = new Cat();
```

The above code can be compiled, but it throws an `ArrayStoreException` when run. Upon closer inspection, the issue lies in the last line. At this point, the object we are manipulating is an `Animal` array, and we naturally assume that any `Animal` object can be added to the array. However, this is not feasible because the underlying array is actually of type `Dog`, so we cannot add a `Cat` to the array. When the program executes this line, it throws an exception.

Java arrays support covariance, but it is not safe because attempting to add inappropriate elements to the array (such as trying to add a cat to a group of dogs) will throw an exception at runtime.

This actually touches on another issue: mutability and immutability. If a collection is mutable, we can continue to add, delete, query, or modify its elements after its creation. Conversely, if a collection is immutable, it becomes read-only after creation, and we cannot make changes to it. Some programming languages have both mutable and immutable collections, so we know that using covariance on these immutable collections is very safe.

### Immutability of Collections

Now let's look at how the Java standard library handles variance with collections. Unsurprisingly, the following code fails to compile, meaning that collections in Java are invariant. Of course, in the example above, we have already demonstrated the invariance of collections.

```java
// failed
List<Animal> animals = new ArrayList<Cat>();
```

### Covariance in Collections

To use covariance in collections, the `extends` syntax is also required. This allows us to safely treat a group of cats as a group of animals. Note that in this case, the identity of this group of animals is that of a producer—we can read its elements but cannot add or modify them, meaning **this covariant collection is read-only**.

```java
List<? extends Animal> animals = List.of(new Cat(), new Cat());
Animal animal1 = animals.get(0);
// This will cause an error—read-only, no writing allowed
// animals.add(new Cat());
```

Of course, this _read-only_ restriction only applies to the use of generic parameters. We can still call methods like `clear()` on the collection to empty it, as this method does not involve any generic parameters.

### Contravariance in Collections

In contrast to covariance, applying contravariance to a collection means it acts as a consumer—**write-only, no reading allowed**. If you forcibly attempt to read from it, you can only obtain an `Object` type.

```java
List<? super Cat> cats = new ArrayList<Animal>();
cats.add(new Cat());
cats.add(new Cat());
Object o = cats.get(0);
```

So, some experts have summarized the PECS principle, which stands for Producer-Extends, Consumer-Super. Producers use the `extends` keyword, while consumers use the `super` keyword.

In the Java standard library, there is a method that perfectly illustrates the PECS principle—the `copy` method in the `java.util.Collections` class. The source code is as follows. It can be seen that the purpose of this method is to copy collections, and it uses two types of generic declarations in its parameters. This allows us to copy collections very flexibly. For example, we can copy a `List<PetDog>` into a `List<Object>`.

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

## Summary

Alright, now everyone should have a complete understanding of the concept of variance. Let me summarize it in slightly more formal terms:

> If A is a subtype of B, it is denoted as `A <= B`. If T is a generic type and U is its parameter, it is denoted as `T<U>`.
>
> If for `A <= B`, we have `T<A> <= T<B>`, this is called **covariance**;
>
> If for `A <= B`, we have `T<A> => T<B>`, this is called **contravariance**;
>
> If for `A <= B`, there is neither covariance nor contravariance, this is called **invariance**.

In Java, covariance is declared using `<? extends T>`, representing any type T or a subtype of T. The `extends` keyword bounds the parent type of the generic parameter, hence it is also called the **upper bound wildcard**. Contravariance is declared using `<? super T>`, representing any type T or a supertype of T. The `super` keyword bounds the child type of the generic parameter, hence it is also called the **lower bound wildcard**.

Typically, covariant parameters appear in the return position of functions, allowing the return of more specific types, while contravariant parameters appear in the parameter position of functions, accepting more general types.

That’s all for the introduction to variance. Later, I’ll supplement this with generics and variance in other languages, which are also quite interesting.

Java codes in this article could be found [here](https://github.com/techstay/study-notes/blob/main/java/java-samples/src/main/java/tech/techstay/generic/VarianceDemo.java).

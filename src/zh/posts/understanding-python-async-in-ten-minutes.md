# 10 分钟学会 python 异步

今天我们来介绍如何在 python 中使用异步编程。本文主要介绍异步编程的用法，所以不会涉及太多底层概念。

## 概念简介

- 协程，是标注为`async`的特殊函数，可以异步执行代码
- 事件循环，python 异步编程的核心，负责调度协程
- Future，一种底层对象，表示异步操作的最终结果
- 任务，是 Future 的封装，可以包装协程，支持取消等操作

我们都知道在操作系统中，创建和切换进程和线程的操作是非常消耗资源的，在高负载场景下容易遭遇性能瓶颈。而协程是程序内部定义的一种更小的执行单元，由于不涉及进程和线程上下文切换的开销，所以协程的运行更加的轻量级，我们可以轻松在程序中创建和运行成千上万的协程。这是使用进程和线程根本无法做到的事情。

协程虽然听起来很神奇，但是实际上协程和普通的函数并没有什么区别，唯一的不同点在于，python 的协程是运行在事件循环上的，这就赋予了协程神奇的并发能力。当我们执行普通函数的时候，如果需要等待 1 秒才能完成，那么所有后续代码都必须等待当前函数执行完成才能继续运行，整个程序的执行是一条直线。而当我们在事件循环上执行协程的时候，如果当前协程需要等待 1 秒才能完成，那么事件循环就会暂停执行这个协程，然后直接寻找下一个可以执行的协程，等到 1 秒过后，再返回继续执行这个协程。整个程序的执行流程类似一个绕成圈的流水线，循环往复运行，所以得名事件循环。

需要注意的是，事件循环实际上是一种假并发，并不是真正的并发执行。如果你正在执行 IO 密集型的任务，例如网络连接或者数据读写，因为这个时候 CPU 实际上没有执行任何操作，完全在等待外部数据输入，所以事件循环可以利用 CPU 等待的这段时间执行下一个任务。而假如你正在执行计算密集型的任务，例如压缩文件，由于这个时候 CPU 被占用了，所以事件循环根本腾不出空间来执行下一个任务。因此如果你需要同时执行多个计算密集型的任务，唯一的办法就是创建多个进程或线程，利用 CPU 的多核能力来实现真正的并发。

## 执行异步代码

使用协程的时候有几个要点：

1. 如果一个函数标注了`async`关键字，它就变成了协程
2. 直接调用协程只会返回协程对象，并不会执行协程，如果要执行协程并返回结果，需要在协程上`await`
3. `await`无法直接在普通函数中使用，只能在协程中调用

可以想到，如果我们在程序中使用了协程，那么为了调用协程，上一级函数也必须标记为`async`，这样一层一层上去，最终主函数也会变成协程，那么主函数又该如何运行呢？答案是使用`asyncio.run`，这个函数会创建一个事件循环，并在事件循环中执行协程。实际上`run`最常见也是正确的用法就是执行 main coroutine。

你可能会想，能不能直接用`run`来调用协程，这样上一级函数调用就不必标记为`async`，这样做其实是可以的，但是`run`本身可以管理事件循环的生命周期，与其多次调用`run`来频繁创建和销毁事件循环，不如直接将 main coroutine 放进去，`run`函数设计出来就是为了执行非阻塞程序入口点的。

```py
import asyncio


async def task1():
    await asyncio.sleep(2)
    return 42


async def main():
    rst = await task1()
    print(rst)


if __name__ == "__main__":
    asyncio.run(main())
# 42
```

## 并发

### 并发代码示例

首先我们看看下面这个代码示例。这个示例演示了运行协程的几种方式。执行这个例子就会发现，`async_sequential_tasks()`协程总共用时 2 秒，和顺序执行的版本用时是一样的。不是说协程是可以并发运行的吗？这是怎么回事呢？

```py
import asyncio
import time
from functools import wraps

from loguru import logger


def sync_task(f: float):
    time.sleep(f)
    return "foo"


async def async_task(f: float):
    await asyncio.sleep(f)
    return "bar"


def measure_time(func):
    @wraps(func)
    def sync_wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        logger.info(f"{func.__name__} used: {end_time - start_time:.4f} seconds.")
        return result

    @wraps(func)
    async def async_wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = await func(*args, **kwargs)
        end_time = time.perf_counter()
        logger.info(f"{func.__name__} used: {end_time - start_time:.4f} seconds.")
        return result

    if asyncio.iscoroutinefunction(func):
        return async_wrapper
    else:
        return sync_wrapper


@measure_time
def sequential_tasks():
    r1 = sync_task(0.5)
    r2 = sync_task(1.5)
    logger.info([r1, r2])


@measure_time
async def async_sequential_tasks():
    r1 = await async_task(0.5)
    r2 = await async_task(1.5)
    logger.info([r1, r2])


@measure_time
async def parallel_tasks():
    r1, r2 = await asyncio.gather(async_task(0.5), async_task(1.5))
    logger.info([r1, r2])


@measure_time
async def parallel_tasks_using_task_group():
    async with asyncio.TaskGroup() as tg:
        r1 = tg.create_task(async_task(0.5))
        r2 = tg.create_task(async_task(1.5))
    logger.info([r1.result(), r2.result()])


async def main():
    sequential_tasks()
    await async_sequential_tasks()
    await parallel_tasks()
    await parallel_tasks_using_task_group()


if __name__ == "__main__":
    asyncio.run(main())

# 23:32:32.565 | INFO     | __main__:sequential_tasks:45 - ['foo', 'foo']
# 23:32:32.565 | INFO     | __main__:sync_wrapper:24 - sequential_tasks used: 2.0011 seconds.
# 23:32:34.568 | INFO     | __main__:async_sequential_tasks:52 - ['bar', 'bar']
# 23:32:34.568 | INFO     | __main__:async_wrapper:32 - async_sequential_tasks used: 2.0031 seconds.
# 23:32:36.069 | INFO     | __main__:parallel_tasks:58 - ['bar', 'bar']
# 23:32:36.069 | INFO     | __main__:async_wrapper:32 - parallel_tasks used: 1.5007 seconds.
# 23:32:37.571 | INFO     | __main__:parallel_tasks_using_task_group:66 - ['bar', 'bar']
# 23:32:37.571 | INFO     | __main__:async_wrapper:32 - parallel_tasks_using_task_group used: 1.5020 seconds.
```

其实原因也很简单，`await`会阻塞代码的执行，直到协程执行完成才会返回结果。所以如果按照平常方式那样分别`await`两个协程，那么效果就和顺序方式执行两个函数是一样的。如果要让协程并发运行，就需要专门的方式来运行协程。

### gather

`asyncio.gather`是一个函数，它可以并发运行多个协程并获取他们的返回值。如果指定了`return_exceptions=True`参数，那么如果其中某个协程触发了异常，`gather`函数不会直接抛出异常，而是继续运行，并将异常包装到返回值列表中。await `gather`函数时，直到所有传入的协程执行完毕之后`gather`才会返回。

如果你希望同时执行多个协程，并且不希望其中某个协程抛出异常影响其他协程的正常执行，那么就选择`gather`函数。

### 任务组

python 3.11 还提供了一种新的方式来执行协程，那就是任务组，也是上面代码中所演示的方法。任务组提供了一种现代的方式来管理多个任务的运行，添加到任务组中的任务会立即开始运行，无需`await`，当所有任务都结束时`async with`就会结束。在最后一个任务结束前，你还可以向任务组提交任务，但是一旦任务组结束就不可以了。此时调用任务的`result()`函数即可获取返回值。如果任意任务抛出异常，其他任务就会取消，任务组会抛出`ExceptionGroup`或者`BaseExceptionGroup`异常，内部包装有任务抛出的异常。

如果你希望同时执行多个协程，并且如果某一个协程抛出异常，就让所有协程一并停止，就使用任务组。如果要创建单个任务，可以直接使用`asyncio.create_task`函数，如果要创建多个相关联的任务，那么使用任务组更适合。

为什么除了协程，我们还需要任务呢？毕竟看上去任务也只不过是把协程再包装了一下而已。这当然是有必要的，协程只是最基本的运行单位，如果需要更高级的操作，例如取消，那么任务就是必须的了。其实除了协程和任务之外，还有一个底层对象 Future，也是异步相关的对象，而且任务实际上就继承自 Future。不过 Future 是底层对象，我们平时不需要使用它。协程、任务和 Future 这三者都是可等待对象，都可以用于`await`。

### 阻塞式 IO

asyncio 库只能用来异步执行非阻塞的 IO 操作，也就是那些明确说明支持异步的类库，例如`httpx`，而一些传统类库如`requests`只支持同步阻塞式的 IO。这种情况下可以使用`asyncio.to_thread`函数将阻塞式 IO 的操作放到另外的线程上运行，避免阻塞当前事件循环。由于 GIL 的存在，所以`to_thread`只能执行 IO bound 的任务，如果在 PyPy 这种不存在 GIL 的 python 实现上，则没有这个限制。

下面的代码使用`time.sleep`模拟阻塞式 IO，这个函数会暂停当前线程，所以必须通过`to_thread`放到其他线程上运行。你或许会注意到别的例子使用`asyncio.sleep`模拟长时间任务，`asyncio.sleep`是支持异步的，所以不会阻塞事件循环。

```py
import asyncio
import time

from loguru import logger


def blocking_io(n: int):
    time.sleep(1)
    return 42 + n


async def main():
    logger.info("task started")
    result = await asyncio.to_thread(blocking_io, 42)
    logger.info(result)


if __name__ == "__main__":
    asyncio.run(main())
```

## 异常处理

### 异常处理代码示例

这里照例使用一段代码来展示如何处理异步的异常。由于任务的取消和超时也会抛出异常，所以干脆放到这里一并讲了。

```py
import asyncio
from random import choice

from loguru import logger


async def number_task(n: int):
    wait_seconds = choice([1, 2, 3, 4, 5]) * 0.5
    await asyncio.sleep(wait_seconds)
    if n == 2:
        raise ValueError(f"Met invalid value {n}")
    return n


async def very_long_work():
    logger.info("very long work started")
    await asyncio.sleep(3600)
    print("SO SO SO SO SO LONG")


async def timeout():
    try:
        await asyncio.wait_for(very_long_work(), timeout=2)
    except TimeoutError:
        logger.error("timeout error: the task took too long")


async def handle_exceptions():
    tasks = [number_task(n) for n in range(5)]
    logger.info("gather tasks started")
    results = await asyncio.gather(*tasks, return_exceptions=True)

    numbers = []
    exceptions = []
    for result in results:
        if isinstance(result, Exception):
            exceptions.append(result)
        else:
            numbers.append(result)

    logger.info(numbers)
    logger.error(exceptions)


async def task_group_with_exceptions():
    try:
        logger.info("task group started")
        async with asyncio.TaskGroup() as tg:
            for i in range(5):
                tg.create_task(number_task(i))
    except BaseExceptionGroup as e:
        logger.error(e)
        logger.error(e.exceptions)


async def cancellation():
    task = asyncio.create_task(very_long_work())
    await asyncio.sleep(1)
    task.cancel()
    await asyncio.sleep(1)
    try:
        await task
    except asyncio.CancelledError:
        logger.info("Task was cancelled")


async def main():
    await timeout()
    await cancellation()
    await handle_exceptions()
    await task_group_with_exceptions()


if __name__ == "__main__":
    asyncio.run(main())
```

### 任务超时

你可以使用`asyncio.wait_for`函数为传入的协程指定一个时间，超过这个时间任务就会自动取消，并抛出`TimeoutError`。如果你只是想要超时提醒，并不希望任务取消，那么就在传入的任务上在包一层`asyncio.shield`函数，它可以防止任务取消。

### 取消任务

如果我们将协程封装到任务中，就可以在需要的时候手动取消任务了。取消任务会抛出`CancelledError`。如果是在任务组中取消任务，则不会中断其他任务的执行，只有`CancelledError`以外的异常才会中断任务组的执行。如果任务组抛出异常，那么`CancelledError`同样也不会被包裹在`ExceptionGroup`中。

根据任务组的这个特性，你可以根据需要选择`gather`或者任务组来并发运行协程。

### 分别处理结果和异常

如果你使用`gather`函数并指定了`return_exceptions=True`参数，那么返回值会同时包含异常。一般我们都会选择将正常的结果和异常分开，然后分别处理。

### 任务组的异常

当我们使用任务组的时候，可能会遇到`ExceptionGroup`异常，它包含有`exceptions`属性，可以获取任务抛出的子异常，按需处理即可。

## 综合示例

最后用一个综合示例脚本作为结束，这个脚本抓取了 awesome-dotnet 中的各种项目并列出最多 star 数的 10 个项目。脚本中利用`httpx`库发起请求，几秒钟内就可以获取数百个项目的 star 数信息，还添加了进度条等功能，可以作为参考。

<https://github.com/techstay/study-notes/blob/main/python/thirdparty-libraries/crawler/awesome_dotnet.py>

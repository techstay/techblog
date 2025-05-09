# Learn Python Asynchronous Programming in 10 Minutes

Today, we'll introduce how to use asynchronous programming in Python. This article focuses on the usage of asynchronous programming, so it won't delve too much into underlying concepts.

## Brief Introduction to Concepts

- **Coroutine**: A special function marked with `async` that can execute code asynchronously.
- **Event Loop**: The core of Python asynchronous programming, responsible for scheduling coroutines.
- **Future**: A low-level object representing the eventual result of an asynchronous operation.
- **Task**: A wrapper for Future that can encapsulate coroutines and supports operations like cancellation.

We all know that in operating systems, creating and switching processes and threads is very resource-intensive, making it prone to performance bottlenecks under high loads. Coroutines, on the other hand, are smaller execution units defined within the program. Since they don't involve the overhead of process and thread context switching, coroutines are much lighter. We can easily create and run thousands of coroutines in a program—something that would be impossible with processes and threads.

Although coroutines may sound magical, they are actually not much different from ordinary functions. The only difference is that Python coroutines run on an event loop, which gives them their magical concurrency capabilities. When we execute a regular function, if it takes 1 second to complete, all subsequent code must wait for the current function to finish before continuing—the entire program execution is a straight line. However, when we execute a coroutine on an event loop, if the current coroutine needs to wait for 1 second, the event loop will pause executing this coroutine and immediately look for the next executable coroutine. After 1 second, it will return to continue executing the paused coroutine. The entire program execution resembles a circular pipeline, looping back and forth—hence the name "event loop."

It's important to note that an event loop is a form of pseudo-concurrency, not true concurrent execution. If you're performing I/O-intensive tasks, such as network connections or data read/write operations, the CPU is essentially idle, waiting for external data input. During this time, the event loop can use the CPU's idle time to execute the next task. However, if you're performing CPU-intensive tasks, such as file compression, the CPU is fully occupied, leaving no room for the event loop to execute the next task. Therefore, if you need to perform multiple CPU-intensive tasks simultaneously, the only solution is to create multiple processes or threads to leverage the CPU's multi-core capabilities for true concurrency.

## Executing Asynchronous Code

There are a few key points to remember when using coroutines:

1. If a function is marked with the `async` keyword, it becomes a coroutine.
2. Directly calling a coroutine only returns the coroutine object—it doesn't execute the coroutine. To execute the coroutine and get its result, you need to `await` it.
3. `await` cannot be used directly in regular functions; it can only be called within coroutines.

You might wonder: if we use coroutines in a program, then to call a coroutine, the parent function must also be marked as `async`. This would propagate upward layer by layer until the main function itself becomes a coroutine. So how do we run the main function? The answer is to use `asyncio.run`. This function creates an event loop and executes the coroutine within it. In fact, the most common—and correct—use of `run` is to execute the main coroutine.

You might think: can we just use `run` to call coroutines directly, so that parent functions don't need to be marked as `async`? While this is technically possible, `run` itself manages the lifecycle of the event loop. Instead of frequently creating and destroying event loops by calling `run` multiple times, it's better to place the main coroutine inside it. The `run` function is designed specifically to execute non-blocking program entry points.

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

## Concurrency

### Concurrent Code Example

First, let's look at the following code example. This example demonstrates several ways to run coroutines. When executing this example, you'll notice that the `async_sequential_tasks()` coroutine takes a total of 2 seconds, the same as the sequentially executed version. Aren't coroutines supposed to run concurrently? What's going on here?

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

The reason is actually quite simple: `await` blocks the execution of the code until the coroutine completes and returns a result. So, if you `await` two coroutines in the usual way, the effect is the same as executing the two functions sequentially. To make coroutines run concurrently, you need a specific method to run them.

### gather

`asyncio.gather` is a function that can run multiple coroutines concurrently and retrieve their return values. If the `return_exceptions=True` parameter is specified, and one of the coroutines raises an exception, the `gather` function will not directly throw the exception but will continue running and wrap the exception in the return value list. When you `await` the `gather` function, it will only return after all the passed coroutines have completed execution.

If you want to execute multiple coroutines simultaneously and don't want an exception in one coroutine to affect the normal execution of others, then choose the `gather` function.

### Task Groups

Python 3.11 also provides a new way to execute coroutines: task groups, which is the method demonstrated in the code above. Task groups offer a modern approach to managing the execution of multiple tasks. Tasks added to a task group start running immediately without needing to `await`. The `async with` block will end once all tasks have completed. You can still submit tasks to the task group before the last task finishes, but once the task group ends, you cannot. At this point, calling the `result()` function of a task will retrieve its return value. If any task raises an exception, other tasks will be canceled, and the task group will raise an `ExceptionGroup` or `BaseExceptionGroup` exception, which wraps the exceptions thrown by the tasks.

If you want to execute multiple coroutines simultaneously and have all coroutines stop if any one raises an exception, use a task group. If you need to create a single task, you can directly use the `asyncio.create_task` function. If you need to create multiple related tasks, using a task group is more appropriate.

Why do we need tasks in addition to coroutines? After all, tasks seem to just wrap coroutines. This is indeed necessary because coroutines are just the basic units of execution. For more advanced operations, such as cancellation, tasks are essential. In fact, besides coroutines and tasks, there is also a lower-level object called Future, which is related to asynchronous operations, and tasks actually inherit from Future. However, Future is a low-level object that we don't usually need to use. Coroutines, tasks, and Future are all awaitable objects and can be used with `await`.

### Blocking IO

The `asyncio` library can only be used to asynchronously execute non-blocking IO operations, specifically those libraries that explicitly support asynchronous operations, such as `httpx`. Traditional libraries like `requests` only support synchronous, blocking IO. In such cases, you can use the `asyncio.to_thread` function to run blocking IO operations in another thread, avoiding blocking the current event loop. Due to the existence of the GIL, `to_thread` can only handle IO-bound tasks. However, on Python implementations like PyPy that do not have a GIL, this limitation does not apply.

The following code uses `time.sleep` to simulate blocking IO. This function pauses the current thread, so it must be run in another thread via `to_thread`. You might notice other examples using `asyncio.sleep` to simulate long-running tasks. `asyncio.sleep` supports asynchronous operations, so it does not block the event loop.

## Exception Handling

### Exception Handling Code Example

As usual, here we use a piece of code to demonstrate how to handle asynchronous exceptions. Since task cancellation and timeouts also throw exceptions, we might as well cover them here together.

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

### Task Timeout

You can use the `asyncio.wait_for` function to specify a time limit for a coroutine. If the task exceeds this time, it will be automatically canceled and a `TimeoutError` will be raised. If you only want a timeout notification without canceling the task, wrap the task with the `asyncio.shield` function, which prevents the task from being canceled.

### Canceling Tasks

If we encapsulate a coroutine into a task, we can manually cancel the task when needed. Canceling a task will raise a `CancelledError`. If the task is canceled within a task group, it will not interrupt the execution of other tasks—only exceptions other than `CancelledError` will halt the task group's execution. If the task group raises an exception, the `CancelledError` will not be wrapped in an `ExceptionGroup`.

Based on this behavior of task groups, you can choose between `gather` or task groups to run coroutines concurrently as needed.

### Handling Results and Exceptions Separately

If you use the `gather` function with the `return_exceptions=True` parameter, the return value will include exceptions. Generally, we prefer to separate normal results from exceptions and handle them individually.

### Task Group Exceptions

When using task groups, you may encounter an `ExceptionGroup` exception, which contains an `exceptions` property that allows you to access the sub-exceptions thrown by the tasks and handle them as needed.

## Comprehensive Example

To conclude, here’s a comprehensive example script that fetches various projects from awesome-dotnet and lists the top 10 projects with the most stars. The script uses the `httpx` library to send requests, retrieves star count information for hundreds of projects in just a few seconds, and includes features like a progress bar for reference.

<https://github.com/techstay/study-notes/blob/main/python/thirdparty-libraries/crawler/awesome_dotnet.py>

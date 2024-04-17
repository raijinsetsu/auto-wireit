import { Verbosity } from '../logging/Verbosity.js';
import { Logger } from '../util/Logger.js';
import { format } from '../util/format.js';

export function LogMethod<ArgType, ReturnType>({
    message,
    verbosity = Verbosity.Info,
}: {
    message: string;
    verbosity?: Verbosity;
}) {
    return <MethodDecorator>(
        function (target, _propertyKey, descriptor: TypedPropertyDescriptor<(...args: ArgType[]) => ReturnType>) {
            const originalMethod = descriptor.value;
            if (typeof originalMethod === 'function') {
                descriptor.value = function (...args: ArgType[]) {
                    Logger.singleton.log(
                        verbosity,
                        format<string | ArgType>(message, target.constructor.name, ...args),
                    );
                    return originalMethod.apply(this, args);
                };
            }
        }
    );
}

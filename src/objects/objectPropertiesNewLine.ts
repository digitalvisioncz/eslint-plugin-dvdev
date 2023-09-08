import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import {
    RuleFixer,
    SourceCode,
} from "@typescript-eslint/utils/ts-eslint";

const createRule = ESLintUtils.RuleCreator(
    () => "dv/object-properties-new-line"
);

type ObjectTypes =
    | TSESTree.ObjectExpression
    | TSESTree.ObjectPattern
    | TSESTree.ImportDeclaration
    | TSESTree.ExportNamedDeclaration;

type ObjectHandleType = 'object' | 'import';

const getObjectPropertiesLength = (node: ObjectTypes): number => {
    if (node.type === "ObjectExpression" || node.type === "ObjectPattern") {
        return node.properties.length;
    }

    if (
        node.type === "ImportDeclaration" ||
        node.type === "ExportNamedDeclaration"
    ) {
        return node.specifiers.length;
    }

    return 0;
};

const areTwoPropertiesOnSameLine = (
    node: ObjectTypes,
    propertiesCount: number,
    sourceCode: Readonly<SourceCode>
) => {
    const firstTokenOfProperty = sourceCode.getFirstToken(node);
    const lastTokenOfProperty = sourceCode.getLastToken(node);

    if (!firstTokenOfProperty || !lastTokenOfProperty) {
        return false;
    }

    const tokenStartLine = firstTokenOfProperty?.loc.start.line;
    const tokenEndLine = lastTokenOfProperty?.loc.end.line;

    if (tokenStartLine === tokenEndLine) {
        return false;
    }

    if (
        tokenStartLine &&
        tokenEndLine &&
        tokenEndLine - tokenStartLine === propertiesCount + 1
    ) {
        return false;
    }

    if (tokenStartLine && tokenEndLine && tokenEndLine - tokenStartLine > 0) {
        return true;
    }

    return false;
};

const arePropertiesOnSameLine = (
    node: ObjectTypes,
    propertiesCount: number,
    sourceCode: Readonly<SourceCode>
) => {
    const firstTokenOfProperty = sourceCode.getFirstToken(node);
    const lastTokenOfProperty = sourceCode.getLastToken(node);

    if (!firstTokenOfProperty || !lastTokenOfProperty) {
        return false;
    }

    const tokenStartLine = firstTokenOfProperty?.loc.start.line;
    const tokenEndLine = lastTokenOfProperty?.loc.end.line;

    if (tokenStartLine === tokenEndLine) {
        return true;
    }

    if (
        tokenStartLine &&
        tokenEndLine &&
        tokenEndLine - tokenStartLine === propertiesCount + 1
    ) {
        return false;
    }

    if (tokenStartLine && tokenEndLine && tokenEndLine - tokenStartLine > 0) {
        return true;
    }

    return false;
};


const hasCommentsBetween = (property: TSESTree.Node, properties: TSESTree.Node[], sourceCode: Readonly<SourceCode>) => {
    const nextProperty = properties[properties.indexOf(property) + 1];

    if (!nextProperty) {
        return false;
    }

    const tokensBetween = sourceCode.getTokensBetween(property, nextProperty);

    // @ts-ignore-next-line
    return tokensBetween.some((token: TSESTree.Token) => token.type === 'CommentLine' || token.type === 'CommentBlock');
}

const fixPropertiesToSeparateLanes = (
    node: ObjectTypes,
    sourceCode: Readonly<SourceCode>,
    fixer: RuleFixer
) => {
    const handleProperties = (properties: TSESTree.Node[], type: ObjectHandleType) => {
        const fixers = [];
        const lastProperty = properties[properties.length - 1];
        const openingBraceToken = sourceCode.getTokenBefore(properties[0]);
        const closingBraceToken = type === 'object' ? sourceCode.getLastToken(node) : sourceCode.getTokenAfter(lastProperty);

        if (!openingBraceToken || !closingBraceToken) {
            return null;
        }

        const hasOpeningNewline = openingBraceToken.loc.end.line < properties[0].loc.start.line;
        const hasClosingNewline = properties[properties.length - 1].loc.end.line < closingBraceToken.loc.start.line;

        properties.map((property, index) => {
            if (hasCommentsBetween(property, properties, sourceCode)) {
                return;
            }

            const trailingCommaToken = sourceCode.getTokenAfter(property);
            const hasTrailingComma = trailingCommaToken?.value === ',';
            const hasTrailingNewline = property.loc.end.line < properties[index + 1]?.loc.start.line;
            const isLastProperty = index === properties.length - 1;

            if (!hasTrailingNewline && !hasTrailingComma && !isLastProperty) {
                const end =  property.range[1];
                const range: [number, number] = [end, end];
                const nextProperty = properties[index + 1];
                const nextPropertyStart =  nextProperty.range[0];
                
                if (property.loc.end.column !== nextProperty.loc.start.column) {
                    fixers.push(fixer.replaceTextRange([end+1, nextPropertyStart], ''));
                }

                fixers.push(fixer.replaceTextRange(range, ',\n'));

                return;
            }

            if (!hasTrailingComma) {
                const end =  property.range[1];
                const range: [number, number] = [end, end];

                fixers.push(fixer.replaceTextRange(range, ','));

                return;
            }

            if (!hasTrailingNewline && hasTrailingComma) {
                const end =  property.range[1];
                const nextProperty = properties[index + 1];
                const nextPropertyStart = nextProperty.range[0];
                
                fixers.push(fixer.replaceTextRange([end+1, nextPropertyStart], ''));
                fixers.push(fixer.insertTextAfter(trailingCommaToken, '\n'));
                
                return;
            }

            if (hasTrailingNewline && hasTrailingComma) {
                const end =  property.range[1];
                const nextProperty = properties[index + 1];
                const nextPropertyStart = nextProperty.range[0];

                fixers.push(fixer.replaceTextRange([end + 1, nextPropertyStart - 1], ''));
                
                return;
            }
        });

        if (!hasOpeningNewline) {
            fixers.push(fixer.insertTextAfter(openingBraceToken, '\n'));
        }

        if (!hasClosingNewline) {
            fixers.push(fixer.insertTextBefore(closingBraceToken, '\n'));
        }

        return fixers;
    };

    if (node.type === "ObjectExpression" || node.type === "ObjectPattern") {
        return handleProperties(node.properties, 'object');
    }


    if (node.type === "ImportDeclaration" || node.type === "ExportNamedDeclaration") {
        return handleProperties(node.specifiers, 'import');
    }

    return null;
};

type MessageIds = "objectPropertiesNewLine";

type Options = [];

const objectPropertiesNewLine = createRule<Options, MessageIds>({
    name: "object-properties-new-line",
    defaultOptions: [],
    meta: {
        type: "layout",
        docs: {
            description: "Enforce object property placement",
        },
        fixable: "whitespace",
        schema: [],
        messages: {
            objectPropertiesNewLine:
                "Object with three or more properties should be on separate lines",
        },
    },
    create(context) {
        const sourceCode = context.sourceCode;

        const check = (node: ObjectTypes) => {
            const propertiesCount = getObjectPropertiesLength(node);

            if (
                propertiesCount === 2 &&
                areTwoPropertiesOnSameLine(node, propertiesCount, sourceCode)
            ) {
                context.report({
                    node,
                    messageId: "objectPropertiesNewLine",
                    fix: (fixer) => fixPropertiesToSeparateLanes(node, sourceCode, fixer),
                });
            }

            if (propertiesCount > 2 && arePropertiesOnSameLine(node, propertiesCount, sourceCode)) {
                context.report({
                    node,
                    messageId: "objectPropertiesNewLine",
                    fix: (fixer) => fixPropertiesToSeparateLanes(node, sourceCode, fixer),
                });
            }
        };

        return {
            ObjectExpression: check,
            ObjectPattern: check,
            ImportDeclaration: check,
            ExportNamedDeclaration: check,
        };
    },
});

export default objectPropertiesNewLine;

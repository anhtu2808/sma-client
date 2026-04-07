import React from 'react';
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer';

const PX_TO_PT = 72 / 96;
const pxToPt = (value) => value * PX_TO_PT;
const PAGE_PADDING_X = pxToPt(50);
const PAGE_PADDING_Y = pxToPt(40);
const PAGE_CONTENT_WIDTH = pxToPt(794 - 50 * 2);

const BLOCK_TAGS = new Set([
  'p',
  'div',
  'h1',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'hr',
  'blockquote',
  'pre',
  'img',
]);

let hyphenationConfigured = false;

if (!hyphenationConfigured) {
  Font.registerHyphenationCallback((word) => [word]);
  hyphenationConfigured = true;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: PAGE_PADDING_Y,
    paddingRight: PAGE_PADDING_X,
    paddingBottom: PAGE_PADDING_Y,
    paddingLeft: PAGE_PADDING_X,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    color: '#1f2937',
    fontSize: pxToPt(13),
    lineHeight: 1.5,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  h1: {
    color: '#2551A5',
    fontSize: pxToPt(28),
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: pxToPt(2),
    lineHeight: 1.2,
  },
  h2: {
    color: '#2551A5',
    fontSize: pxToPt(18),
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: pxToPt(0.9),
    marginTop: pxToPt(16),
    marginBottom: pxToPt(4),
    lineHeight: 1.3,
  },
  h3: {
    fontSize: pxToPt(15),
    fontWeight: 700,
    marginTop: pxToPt(8),
    marginBottom: pxToPt(4),
    lineHeight: 1.4,
  },
  paragraph: {
    fontSize: pxToPt(13),
    marginTop: pxToPt(2),
    marginBottom: pxToPt(2),
    lineHeight: 1.5,
    color: '#1f2937',
  },
  hr: {
    borderTopWidth: 1.125,
    borderTopColor: '#2551A5',
    marginTop: pxToPt(4),
    marginBottom: pxToPt(8),
  },
  list: {
    marginTop: pxToPt(4),
    marginBottom: pxToPt(4),
    paddingLeft: pxToPt(24),
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: pxToPt(1),
    marginBottom: pxToPt(1),
  },
  listBullet: {
    width: pxToPt(16),
    fontSize: pxToPt(13),
    lineHeight: 1.6,
  },
  listItemBody: {
    flex: 1,
    minWidth: 0,
  },
  listItemText: {
    fontSize: pxToPt(13),
    lineHeight: 1.6,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: pxToPt(8),
    marginBottom: pxToPt(2),
  },
  entryHeaderTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: pxToPt(14),
    fontWeight: 700,
    paddingRight: pxToPt(12),
  },
  entryHeaderDate: {
    fontSize: pxToPt(13),
    color: '#374151',
    fontWeight: 700,
    textAlign: 'right',
    flexShrink: 0,
  },
  blockquote: {
    borderLeftWidth: 2.25,
    borderLeftColor: '#e5e7eb',
    paddingLeft: pxToPt(12),
    marginTop: pxToPt(8),
    marginBottom: pxToPt(8),
  },
  blockquoteText: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
  pre: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    paddingTop: pxToPt(12),
    paddingRight: pxToPt(16),
    paddingBottom: pxToPt(12),
    paddingLeft: pxToPt(16),
    borderRadius: 6,
    marginTop: pxToPt(8),
    marginBottom: pxToPt(8),
    fontFamily: 'Courier',
    fontSize: pxToPt(12),
    lineHeight: 1.45,
  },
  inlineCode: {
    fontFamily: 'Courier',
    fontSize: pxToPt(12),
    backgroundColor: '#f3f4f6',
  },
  link: {
    color: '#2551A5',
    textDecoration: 'underline',
  },
  image: {
    marginTop: pxToPt(8),
    marginBottom: pxToPt(8),
    maxWidth: PAGE_CONTENT_WIDTH,
    objectFit: 'contain',
  },
  sectionHeaderGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const getNodeName = (node) => (node?.nodeType === 1 ? node.nodeName.toLowerCase() : '');

const hasOnlyWhitespace = (node) =>
  node?.nodeType === 3 && !`${node.textContent || ''}`.replace(/\u00a0/g, ' ').trim();

const normalizeInlineText = (text) => `${text || ''}`.replace(/\s+/g, ' ');

const toCamelCase = (value) => value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

const parseCssLength = (value, baseFontSize = pxToPt(13)) => {
  if (!value) return undefined;
  const normalized = `${value}`.trim().toLowerCase();
  if (!normalized) return undefined;
  if (normalized === '0') return 0;
  if (normalized.endsWith('px')) return pxToPt(parseFloat(normalized));
  if (normalized.endsWith('pt')) return parseFloat(normalized);
  if (normalized.endsWith('em')) return baseFontSize * parseFloat(normalized);
  if (/^-?\d+(\.\d+)?$/.test(normalized)) return parseFloat(normalized);
  return undefined;
};

const applySpacingShorthand = (style, property, rawValue, baseFontSize) => {
  const values = `${rawValue}`
    .trim()
    .split(/\s+/)
    .map((item) => parseCssLength(item, baseFontSize));

  if (values.some((value) => value === undefined)) return;

  if (values.length === 1) {
    style[`${property}Top`] = values[0];
    style[`${property}Right`] = values[0];
    style[`${property}Bottom`] = values[0];
    style[`${property}Left`] = values[0];
    return;
  }

  if (values.length === 2) {
    style[`${property}Top`] = values[0];
    style[`${property}Right`] = values[1];
    style[`${property}Bottom`] = values[0];
    style[`${property}Left`] = values[1];
    return;
  }

  if (values.length === 3) {
    style[`${property}Top`] = values[0];
    style[`${property}Right`] = values[1];
    style[`${property}Bottom`] = values[2];
    style[`${property}Left`] = values[1];
    return;
  }

  style[`${property}Top`] = values[0];
  style[`${property}Right`] = values[1];
  style[`${property}Bottom`] = values[2];
  style[`${property}Left`] = values[3];
};

const parseStyleAttribute = (styleString, baseFontSize = pxToPt(13)) => {
  if (!styleString) return null;

  const style = {};
  styleString
    .split(';')
    .map((rule) => rule.trim())
    .filter(Boolean)
    .forEach((rule) => {
      const separatorIndex = rule.indexOf(':');
      if (separatorIndex === -1) return;

      const property = rule.slice(0, separatorIndex).trim().toLowerCase();
      const rawValue = rule.slice(separatorIndex + 1).trim();
      if (!rawValue) return;

      switch (property) {
        case 'font-size': {
          const value = parseCssLength(rawValue, baseFontSize);
          if (value !== undefined) style.fontSize = value;
          break;
        }
        case 'line-height': {
          const numeric = parseFloat(rawValue);
          if (!Number.isNaN(numeric)) {
            style.lineHeight = /px|pt|em/.test(rawValue)
              ? parseCssLength(rawValue, baseFontSize)
              : numeric;
          }
          break;
        }
        case 'font-weight':
          style.fontWeight = rawValue === 'bold' ? 700 : rawValue;
          break;
        case 'font-style':
          style.fontStyle = rawValue;
          break;
        case 'text-decoration':
        case 'text-decoration-line':
          style.textDecoration = rawValue;
          break;
        case 'text-transform':
          style.textTransform = rawValue;
          break;
        case 'text-align':
          style.textAlign = rawValue;
          break;
        case 'letter-spacing': {
          const value = parseCssLength(rawValue, baseFontSize);
          if (value !== undefined) style.letterSpacing = value;
          break;
        }
        case 'color':
          style.color = rawValue;
          break;
        case 'background':
        case 'background-color':
          style.backgroundColor = rawValue;
          break;
        case 'margin':
          applySpacingShorthand(style, 'margin', rawValue, baseFontSize);
          break;
        case 'padding':
          applySpacingShorthand(style, 'padding', rawValue, baseFontSize);
          break;
        case 'margin-top':
        case 'margin-right':
        case 'margin-bottom':
        case 'margin-left':
        case 'padding-top':
        case 'padding-right':
        case 'padding-bottom':
        case 'padding-left': {
          const value = parseCssLength(rawValue, baseFontSize);
          if (value !== undefined) {
            style[toCamelCase(property)] = value;
          }
          break;
        }
        case 'width':
        case 'height':
        case 'border-radius': {
          const value = parseCssLength(rawValue, baseFontSize);
          if (value !== undefined) {
            style[toCamelCase(property)] = value;
          }
          break;
        }
        default:
          break;
      }
    });

  return Object.keys(style).length > 0 ? style : null;
};

const getBaseFontSizeForNode = (nodeName) => {
  switch (nodeName) {
    case 'h1':
      return pxToPt(28);
    case 'h2':
      return pxToPt(18);
    case 'h3':
      return pxToPt(15);
    case 'div':
      return pxToPt(14);
    default:
      return pxToPt(13);
  }
};

const getNodeStyle = (node, fallbackFontSize) =>
  parseStyleAttribute(node?.getAttribute?.('style') || '', fallbackFontSize);

const getChildNodes = (node) =>
  Array.from(node?.childNodes || []).filter((child) => !hasOnlyWhitespace(child));

const hasBlockChildren = (node) =>
  getChildNodes(node).some((child) => child.nodeType === 1 && BLOCK_TAGS.has(getNodeName(child)));

const inlineImageSources = async (htmlContent) => {
  if (!htmlContent || typeof DOMParser === 'undefined') return htmlContent || '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const images = Array.from(doc.querySelectorAll('img[src]')).filter(
    (img) => img.getAttribute('src') && !img.getAttribute('src').startsWith('data:')
  );

  await Promise.all(
    images.map(async (img) => {
      try {
        const response = await fetch(img.getAttribute('src'));
        const blob = await response.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        img.setAttribute('src', dataUrl);
      } catch (error) {
        console.warn('Could not inline image for PDF export:', error);
      }
    })
  );

  return doc.body.innerHTML;
};

const renderInlineChildren = (nodes, path) =>
  nodes.flatMap((node, index) => renderInlineNode(node, `${path}-${index}`)).filter(Boolean);

const renderInlineNode = (node, key) => {
  if (node.nodeType === 3) {
    const text = normalizeInlineText(node.textContent);
    return text ? [text] : [];
  }

  if (node.nodeType !== 1) return [];

  const nodeName = getNodeName(node);
  const style = getNodeStyle(node, getBaseFontSizeForNode(nodeName));
  const children = renderInlineChildren(getChildNodes(node), key);

  switch (nodeName) {
    case 'br':
      return ['\n'];
    case 'strong':
    case 'b':
      return [
        <Text key={key} style={[style, { fontWeight: 700 }]}>
          {children}
        </Text>,
      ];
    case 'em':
    case 'i':
      return [
        <Text key={key} style={[style, { fontStyle: 'italic' }]}>
          {children}
        </Text>,
      ];
    case 'u':
      return [
        <Text key={key} style={[style, { textDecoration: 'underline' }]}>
          {children}
        </Text>,
      ];
    case 'a':
      return [
        <Link key={key} src={node.getAttribute('href') || undefined} style={[styles.link, style]}>
          {children}
        </Link>,
      ];
    case 'code':
      return [
        <Text key={key} style={[styles.inlineCode, style]}>
          {children}
        </Text>,
      ];
    default:
      if (hasBlockChildren(node)) {
        const text = normalizeInlineText(node.textContent);
        return text ? [text] : [];
      }
      return [
        <Text key={key} style={style}>
          {children}
        </Text>,
      ];
  }
};

const renderTextBlock = (node, key, baseStyle) => (
  <Text key={key} style={[baseStyle, getNodeStyle(node, getBaseFontSizeForNode(getNodeName(node)))]}>
    {renderInlineChildren(getChildNodes(node), key)}
  </Text>
);

const renderList = (node, key, ordered = false) => {
  const listStyle = [styles.list, getNodeStyle(node, pxToPt(13))];
  const items = getChildNodes(node).filter((child) => getNodeName(child) === 'li');

  return (
    <View key={key} style={listStyle}>
      {items.map((item, index) => renderListItem(item, `${key}-item-${index}`, ordered ? index + 1 : null))}
    </View>
  );
};

const renderListItem = (node, key, indexNumber) => {
  const blockChildren = getChildNodes(node).filter(
    (child) => child.nodeType === 1 && BLOCK_TAGS.has(getNodeName(child))
  );

  const bullet = indexNumber ? `${indexNumber}.` : '\u2022';
  const inlineChildren = blockChildren.length === 0 ? renderInlineChildren(getChildNodes(node), `${key}-inline`) : null;

  return (
    <View key={key} style={styles.listItemRow}>
      <Text style={styles.listBullet}>{bullet}</Text>
      <View style={styles.listItemBody}>
        {blockChildren.length > 0 ? (
          blockChildren.map((child, childIndex) => renderBlockNode(child, `${key}-block-${childIndex}`, true))
        ) : (
          <Text style={styles.listItemText}>{inlineChildren}</Text>
        )}
      </View>
    </View>
  );
};

const renderEntryHeader = (node, key) => {
  const titleStyle = getNodeStyle(node, pxToPt(14));
  const date = node.getAttribute('data-date');

  return (
    <View key={key} style={[styles.entryHeader, titleStyle]} wrap={false}>
      <Text style={styles.entryHeaderTitle}>{renderInlineChildren(getChildNodes(node), `${key}-title`)}</Text>
      {date ? <Text style={styles.entryHeaderDate}>{date}</Text> : null}
    </View>
  );
};

const renderBlockquote = (node, key) => {
  const childNodes = getChildNodes(node);
  const hasNestedBlocks = childNodes.some(
    (child) => child.nodeType === 1 && BLOCK_TAGS.has(getNodeName(child))
  );

  return (
    <View key={key} style={[styles.blockquote, getNodeStyle(node, pxToPt(13))]}>
      {hasNestedBlocks
        ? childNodes.map((child, index) =>
            renderBlockNode(child, `${key}-child-${index}`, false, styles.blockquoteText)
          )
        : (
          <Text style={[styles.paragraph, styles.blockquoteText]}>
            {renderInlineChildren(childNodes, `${key}-inline`)}
          </Text>
        )}
    </View>
  );
};

const renderPreformatted = (node, key) => (
  <Text key={key} style={[styles.pre, getNodeStyle(node, pxToPt(12))]}>
    {node.textContent || ''}
  </Text>
);

const renderImageBlock = (node, key) => {
  const src = node.getAttribute('src');
  if (!src) return null;

  return <Image key={key} src={src} style={[styles.image, getNodeStyle(node, pxToPt(13))]} />;
};

const renderGenericDiv = (node, key, inheritedStyle) => {
  if (node.getAttribute('data-type') === 'entryHeader') {
    return renderEntryHeader(node, key);
  }

  if (hasBlockChildren(node)) {
    return (
      <View key={key} style={getNodeStyle(node, pxToPt(13))}>
        {getChildNodes(node).map((child, index) =>
          renderBlockNode(child, `${key}-child-${index}`, false, inheritedStyle)
        )}
      </View>
    );
  }

  return (
    <Text key={key} style={[styles.paragraph, inheritedStyle, getNodeStyle(node, pxToPt(13))]}>
      {renderInlineChildren(getChildNodes(node), key)}
    </Text>
  );
};

const renderBlockNode = (node, key, insideListItem = false, inheritedStyle = null) => {
  if (!node) return null;

  if (node.nodeType === 3) {
    const text = normalizeInlineText(node.textContent);
    return text ? (
      <Text key={key} style={[insideListItem ? styles.listItemText : styles.paragraph, inheritedStyle]}>
        {text}
      </Text>
    ) : null;
  }

  if (node.nodeType !== 1) return null;

  const nodeName = getNodeName(node);

  switch (nodeName) {
    case 'h1':
      return renderTextBlock(node, key, styles.h1);
    case 'h2':
      return renderTextBlock(node, key, styles.h2);
    case 'h3':
      return renderTextBlock(node, key, styles.h3);
    case 'p':
      return renderTextBlock(node, key, [insideListItem ? styles.listItemText : styles.paragraph, inheritedStyle]);
    case 'ul':
      return renderList(node, key, false);
    case 'ol':
      return renderList(node, key, true);
    case 'hr':
      return <View key={key} style={styles.hr} />;
    case 'blockquote':
      return renderBlockquote(node, key);
    case 'pre':
      return renderPreformatted(node, key);
    case 'img':
      return renderImageBlock(node, key);
    case 'div':
      return renderGenericDiv(node, key, inheritedStyle);
    default:
      if (hasBlockChildren(node)) {
        return (
          <View key={key} style={getNodeStyle(node, pxToPt(13))}>
            {getChildNodes(node).map((child, index) =>
              renderBlockNode(child, `${key}-child-${index}`, insideListItem, inheritedStyle)
            )}
          </View>
        );
      }
      return (
        <Text key={key} style={[insideListItem ? styles.listItemText : styles.paragraph, inheritedStyle, getNodeStyle(node, pxToPt(13))]}>
          {renderInlineChildren(getChildNodes(node), key)}
        </Text>
      );
  }
};

const renderTopLevelBlocks = (nodes) => {
  const rendered = [];

  for (let index = 0; index < nodes.length; index += 1) {
    const current = nodes[index];
    const currentName = getNodeName(current);

    if (currentName === 'h2') {
      const group = [current];
      let consumed = 1;

      if (getNodeName(nodes[index + 1]) === 'hr') {
        group.push(nodes[index + 1]);
        consumed += 1;
      }

      if (nodes[index + consumed]) {
        group.push(nodes[index + consumed]);
        consumed += 1;
      }

      rendered.push(
        <View key={`section-${index}`} style={styles.sectionHeaderGroup} wrap={false}>
          {group.map((node, groupIndex) => renderBlockNode(node, `section-${index}-${groupIndex}`))}
        </View>
      );
      index += consumed - 1;
      continue;
    }

    rendered.push(renderBlockNode(current, `block-${index}`));
  }

  return rendered.filter(Boolean);
};

const createPdfDocument = (htmlContent, title) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent || '', 'text/html');
  const nodes = getChildNodes(doc.body);

  return (
    <Document title={title}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.root}>{renderTopLevelBlocks(nodes)}</View>
      </Page>
    </Document>
  );
};

export const buildEnhancementPdfBlob = async ({ htmlContent, title }) => {
  const normalizedHtml = await inlineImageSources(htmlContent || '');
  const blob = await pdf(createPdfDocument(normalizedHtml, title)).toBlob();
  return blob;
};

export default buildEnhancementPdfBlob;

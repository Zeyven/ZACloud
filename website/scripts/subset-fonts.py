"""Regenerate the self-hosted Chinese subset after copy changes.
Requires fontTools and brotli; source must be a licensed Noto Sans CJK collection.
"""
from pathlib import Path
import argparse
from fontTools import subset
parser=argparse.ArgumentParser()
parser.add_argument('--source',default='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
args=parser.parse_args()
chars=''.join(sorted({char for path in Path('src').rglob('*') if path.suffix in ('.ts','.tsx') for char in path.read_text() if ord(char)>127}))
Path('scripts/font-characters.txt').write_text(chars)
options=subset.Options();options.font_number=2;options.flavor='woff2';options.layout_features=['*']
font=subset.load_font(args.source,options)
subsetter=subset.Subsetter(options=options);subsetter.populate(text=chars);subsetter.subset(font)
subset.save_font(font,'src/fonts/noto-sans-sc-subset.woff2',options)
print(f'Subset generated for {len(chars)} non-ASCII characters.')

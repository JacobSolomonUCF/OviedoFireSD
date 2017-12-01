package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.graphics.Color;
import android.view.ViewGroup;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

/**
 * Created by David on 11/10/2017.
 */

public class AddPrevResult {
    static void AddPrev(TableLayout mTableLayout, String prev, Context context, boolean isTablet, int width, int mode){
        TableRow prevTextRow=new TableRow(context);
        mTableLayout.addView(prevTextRow);
        TableLayout.LayoutParams rowParams = new TableLayout.LayoutParams(width, ViewGroup.LayoutParams.WRAP_CONTENT);
        prevTextRow.setLayoutParams(rowParams);
        prevTextRow.setTag("Prev Row");
        TextView prevResultLabel = new TextView(context);
        prevResultLabel.setText("Previous result:");
        TextView prevResultResult = new TextView(context);
        if (prev.equals("Failed")||prev.equals("0%")) {
            prevResultResult.setTextColor(Color.RED);
            prevResultLabel.setTextColor(Color.RED);
        }
        else{
            prevResultResult.setTextColor(Color.parseColor("#0b6e4f"));
            prevResultLabel.setTextColor(Color.parseColor("#0b6e4f"));
        }
        prevResultResult.setText(prev);
        System.out.println(prev);
        if(isTablet){
            prevResultLabel.setTextSize(18);
            prevResultResult.setTextSize(18);
        }
        prevTextRow.addView(prevResultLabel);
        prevTextRow.addView(prevResultResult);
        TableRow.LayoutParams textParams = new TableRow.LayoutParams(width/2, ViewGroup.LayoutParams.WRAP_CONTENT);
        prevResultLabel.setLayoutParams(textParams);
        prevResultResult.setLayoutParams(textParams);
    }
    static void AddPrevPMR(TableLayout mTableLayout, String prev, Context context, boolean isTablet, int width, int mode, String note){
        TableRow prevTextRow=new TableRow(context);
        mTableLayout.addView(prevTextRow);
        TableLayout.LayoutParams rowParams = new TableLayout.LayoutParams(width, ViewGroup.LayoutParams.WRAP_CONTENT);
        prevTextRow.setLayoutParams(rowParams);
        prevTextRow.setTag("Prev Row");
        TextView prevResultLabel = new TextView(context);
        prevResultLabel.setText("Previous result:");
        TextView prevResultResult = new TextView(context);;
        if (prev.equals("Missing")||prev.equals("Repairs Needed")) {
            prevResultResult.setTextColor(Color.RED);
            prevResultLabel.setTextColor(Color.RED);
        }
        else{
            prevResultResult.setTextColor(Color.parseColor("#0b6e4f"));
            prevResultLabel.setTextColor(Color.parseColor("#0b6e4f"));
        }
        prevResultResult.setText(prev);
        System.out.println(prev);

        if (note!=null&&!note.isEmpty()) {
            TextView prevResultNote = new TextView(context);
            prevResultNote.setPadding(10, 0, 10, 0);
            mTableLayout.addView(prevResultNote);
            prevResultNote.setText("Previous Comments: " + note);
            prevResultNote.setTextSize(12);
            prevResultNote.setTextColor(Color.RED);
            if (isTablet) prevResultNote.setTextSize(18);
        }

        if(isTablet){
            prevResultLabel.setTextSize(18);
            prevResultResult.setTextSize(18);
        }
        prevTextRow.addView(prevResultLabel);
        prevTextRow.addView(prevResultResult);
        TableRow.LayoutParams textParams = new TableRow.LayoutParams(width/2, ViewGroup.LayoutParams.WRAP_CONTENT);
        prevResultLabel.setLayoutParams(textParams);
        prevResultResult.setLayoutParams(textParams);
    }
}

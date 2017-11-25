package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by David on 9/28/2017.
 */

public class ToDoJSONParser {
    public static ArrayList<LinearLayout> toDoParse(String str, TableLayout mTableLayout, Context context, boolean isTablet, LinearLayout mLinearLayout, Resources r){
        String parseStr = "";
        int dash=-1;
        String subStr = "";
        mTableLayout.removeAllViews();
        ArrayList<LinearLayout> buttons = new ArrayList();
        boolean flag=true;
        try {
            JSONObject object = (JSONObject) new JSONObject(str);
            JSONArray sections = object.getJSONArray("list");
            for (int i=0; i<sections.length(); i++){
                JSONObject object2=sections.getJSONObject(i);
                String name=object2.getString("name");
                String formId=object2.getString("formId");
                String cb=object2.getString("completeBy");
                cb = "Complete by: "+cb;
                /*if (!parseStr.isEmpty()){
                    System.out.println("1");
                    if (!name.contains("-")){
                        System.out.println("1a");
                        TableRow dividerRow = new TableRow(context);
                        dividerRow.setBackgroundResource(R.drawable.daviddivider);
                        mTableLayout.addView(dividerRow);
                        parseStr="";
                    }
                    else{
                        System.out.println("1b");
                        if (name.substring(0,dash).compareTo(subStr)!=0) {
                            System.out.println("1c");
                            TableRow dividerRow = new TableRow(context);
                            dividerRow.setBackgroundResource(R.drawable.daviddivider);
                            mTableLayout.addView(dividerRow);
                        }
                    }
                    System.out.println("2");
                    parseStr=name;
                    if (parseStr.contains("-")) {
                        System.out.println("2a");
                        dash = parseStr.indexOf("-");
                        subStr = parseStr.substring(0, dash);
                    }
                    else {
                        System.out.println("2b");
                        subStr=parseStr;
                        parseStr="";
                    }
                }
                else{
                    TableRow dividerRow = new TableRow(context);
                    dividerRow.setBackgroundResource(R.drawable.daviddivider);
                    mTableLayout.addView(dividerRow);
                    parseStr=name;
                    if (parseStr.contains("-")) {
                        dash = parseStr.indexOf("-");
                        subStr = parseStr.substring(0, dash);
                        System.out.println("empty, dash");
                    }
                    else {
                        dash = -1;
                        subStr=parseStr;
                        System.out.println("empty, no dash");
                    }
                }
                */
                TableRow tableRow = new TableRow(context);
                TableLayout.LayoutParams rowParams = new TableLayout.LayoutParams(TableLayout.LayoutParams.MATCH_PARENT, TableLayout.LayoutParams.WRAP_CONTENT);
                tableRow.setLayoutParams(rowParams);
                mTableLayout.addView(tableRow);
                TextView lTextView = new TextView(context);
                TextView rTextView = new TextView(context);
                rTextView.setText(cb);
                //Button button=new Button(context);
                LinearLayout button = new LinearLayout(context);
                buttons.add(button);
                lTextView.setText(name);
                button.addView(lTextView);
                button.addView(rTextView);
                button.setBackgroundColor(Color.BLACK);
                lTextView.setTextColor(Color.WHITE);
                lTextView.setTextSize(16);
                rTextView.setTextColor(Color.WHITE);
                rTextView.setTextSize(12);
                button.setTag(formId);
                System.out.println(button.getTag());
                tableRow.addView(button);
                TableRow.LayoutParams buttonParams = new TableRow.LayoutParams(TableRow.LayoutParams.MATCH_PARENT, TableRow.LayoutParams.WRAP_CONTENT);
                float pxLeftMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 0, r.getDisplayMetrics());
                float pxRightMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 0, r.getDisplayMetrics());
                float pxTopMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 1, r.getDisplayMetrics());
                float pxBottomMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 1, r.getDisplayMetrics());
                buttonParams.setMargins(Math.round(pxLeftMargin), Math.round(pxTopMargin), Math.round(pxRightMargin), Math.round(pxBottomMargin));
                button.setLayoutParams(buttonParams);
                int width=mLinearLayout.getWidth();
                System.out.println("thisisthewidth"+width);
                pxTopMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 10, r.getDisplayMetrics());
                pxBottomMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 10, r.getDisplayMetrics());
                LinearLayout.LayoutParams relParamLeft= new LinearLayout.LayoutParams(width/2, LinearLayout.LayoutParams.WRAP_CONTENT,1);
                LinearLayout.LayoutParams relParamRight= new LinearLayout.LayoutParams(width/2, LinearLayout.LayoutParams.WRAP_CONTENT,1);
                relParamLeft.setMargins(Math.round(pxLeftMargin), Math.round(pxTopMargin), Math.round(pxRightMargin), Math.round(pxBottomMargin));
                relParamRight.setMargins(Math.round(pxLeftMargin), Math.round(pxTopMargin), Math.round(pxRightMargin), Math.round(pxBottomMargin));
                lTextView.setLayoutParams(relParamLeft);
                rTextView.setLayoutParams(relParamRight);
                rTextView.setGravity(Gravity.RIGHT);
                lTextView.setTextSize(16);
                rTextView.setTextSize(12);
                if(isTablet)lTextView.setTextSize(30);
                if(isTablet)rTextView.setTextSize(22);
                //tableRow.addView(textView);

            }
        } catch (JSONException e) {
            // Appropriate error handling code
        }
        return buttons;
    }
}
